"""Viewsets for the tracking app."""

from __future__ import annotations

from copy import deepcopy
from datetime import date
from typing import TYPE_CHECKING

import django_excel
from django.conf import settings
from django.db import DatabaseError, transaction
from django.db.models import Case, CharField, F, Q, Value, When
from django.http import HttpResponseBadRequest
from django.utils.translation import gettext_lazy as _
from rest_framework import exceptions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from timed.employment.models import Employment, PublicHoliday, User
from timed.permissions import (
    IsAccountant,
    IsAuthenticated,
    IsEmployed,
    IsExternal,
    IsInternal,
    IsNotBilled,
    IsNotDelete,
    IsNotTransferred,
    IsOwner,
    IsReadOnly,
    IsResource,
    IsReviewer,
    IsSuperUser,
    IsSupervisor,
    IsUnverified,
)
from timed.projects.models import CustomerAssignee, Task
from timed.serializers import AggregateObject
from timed.tracking import filters, models, serializers

from . import tasks

if TYPE_CHECKING:
    from django.db.models import QuerySet
    from rest_framework.request import Request


class ActivityViewSet(ModelViewSet):
    """Activity view set."""

    serializer_class = serializers.ActivitySerializer
    filterset_class = filters.ActivityFilterSet
    permission_classes = (
        (
            # users may not change transferred activities
            IsAuthenticated & IsInternal & IsNotTransferred
            | IsAuthenticated & IsReadOnly
            # only external employees with resource role may create not transferred activities
            | IsAuthenticated & IsExternal & IsResource & IsNotTransferred
        ),
    )

    def get_queryset(self) -> QuerySet[models.Activity]:
        """Filter the queryset by the user of the request."""
        return models.Activity.objects.select_related(
            "task", "user", "task__project", "task__project__customer"
        ).filter(user=self.request.user)


class AttendanceViewSet(ModelViewSet):
    """Attendance view set."""

    serializer_class = serializers.AttendanceSerializer
    filterset_class = filters.AttendanceFilterSet
    permission_classes = (
        (
            # superuser may edit all reports but not delete
            IsSuperUser & IsNotDelete
            # internal employees may change own attendances
            | IsAuthenticated & IsInternal
            # only external employees with resource role may change own attendances
            | IsAuthenticated & IsExternal & IsResource
        ),
    )

    def get_queryset(self) -> QuerySet[models.Attendance]:
        """Filter the queryset by the user of the request."""
        return models.Attendance.objects.select_related("user").filter(
            user=self.request.user
        )


class ReportViewSet(ModelViewSet):
    """Report view set."""

    serializer_class = serializers.ReportSerializer
    filterset_class = filters.ReportFilterSet
    queryset = models.Report.objects.select_related(
        "task", "user", "task__project", "task__project__customer"
    )
    permission_classes = (
        (
            # superuser and accountants may edit all reports but not delete
            (IsSuperUser | IsAccountant) & IsNotDelete
            # reviewer and supervisor may change reports which aren't verified or billed but not delete them
            | (IsReviewer | IsSupervisor) & (IsUnverified | IsNotBilled) & IsNotDelete
            # internal employees may only change its own unverified reports
            # only external employees with resource role may only change its own unverified reports
            | IsOwner & IsUnverified & (IsInternal | (IsExternal & IsResource))
            # all authenticated users may read all reports
            | IsAuthenticated & IsReadOnly
        ),
    )
    ordering = (
        "date",
        "id",
    )
    ordering_fields = (
        "id",
        "date",
        "duration",
        "task__project__customer__name",
        "task__project__name",
        "task__name",
        "user__username",
        "comment",
        "verified_by__username",
        "review",
        "not_billable",
        "rejected",
    )

    def get_queryset(self) -> QuerySet[models.Report]:
        """Get filtered reports for external employees."""
        user = self.request.user
        queryset = super().get_queryset()
        queryset.select_related(
            "task", "user", "task__project", "task__project__customer"
        )

        try:
            current_employment = Employment.objects.get_at(user=user, date=date.today())
        except Employment.DoesNotExist:
            if CustomerAssignee.objects.filter(user=user, is_customer=True).exists():
                return queryset.filter(
                    Q(
                        task__project__customer__customer_assignees__user=user,
                        task__project__customer__customer_assignees__is_customer=True,
                        task__project__customer_visible=True,
                    )
                )
            msg = "User has no employment and isn't a customer!"
            raise exceptions.PermissionDenied(msg) from None
        if not current_employment.is_external:
            return queryset

        assigned_tasks = Task.objects.filter(
            Q(task_assignees__user=user, task_assignees__is_reviewer=True)
            | Q(
                project__project_assignees__user=user,
                project__project_assignees__is_reviewer=True,
            )
            | Q(
                project__customer__customer_assignees__user=user,
                project__customer__customer_assignees__is_reviewer=True,
            )
        )
        return queryset.filter(Q(task__in=assigned_tasks) | Q(user=user))

    def update(self, request, *args, **kwargs):
        """Override so we can issue emails on update."""
        partial = kwargs.get("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        if request.user != instance.user:
            # send a notification only when the user is updating someone else's report
            fields = {
                key: value
                for key, value in serializer.validated_data.items()
                # value equal None means do not touch
                if value is not None
            }

            if fields:
                tasks.notify_user_changed_report(instance, request.user, fields=fields)
            if fields.get("rejected"):
                tasks.notify_user_changed_report(instance, request.user, rejected=True)

        return super().update(request, *args, **kwargs)

    @action(
        detail=False,
        methods=["get"],
        serializer_class=serializers.ReportIntersectionSerializer,
    )
    def intersection(self, _request):
        """Get intersection in reports of common report fields.

        Use case is for api caller to know what fields are the same
        in a list of reports. This will be mainly used for bulk update.

        This will always return a single resource.
        """
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)

        # filter params represent main indication of result
        # so it can be used as id
        params = self.request.query_params.copy()
        ignore_params = {"ordering", "page", "page_size", "include"}
        for param in ignore_params.intersection(params.keys()):
            del params[param]

        data = AggregateObject(queryset=queryset, pk=params.urlencode())
        serializer = self.get_serializer(data)
        return Response(data=serializer.data)

    def _validate_verified(
        self,
        user: User,
        *,
        can_verify: bool,
        existing_db_rejected: bool,
    ) -> None:
        # only reviewer or superuser may verify reports
        if not user.is_superuser and not can_verify:
            raise exceptions.ValidationError(
                _("Only reviewers and superusers are allowed to verify")
            )

        if existing_db_rejected:
            raise exceptions.ValidationError(
                _("Reports can't be rejected and verified at the same time.")
            )

    def _validate_task(
        self,
        queryset: QuerySet[models.Report],
        fields: dict,
        review_comment: str,
        *,
        existing_db_verified: bool,
    ) -> None:
        # if no review comment was given, we validate that the customer of all the
        # reports (that are being updated/attempted to be updated) is the same, if
        # it isn't, we throw an error
        if (
            not review_comment
            and queryset.exclude(
                task__project__customer=fields["task"].project.customer
            ).exists()
        ):
            raise exceptions.ValidationError(
                _("Review Comment is required when changing/moving customer."),
                "required",
            )

        if existing_db_verified:
            raise exceptions.ValidationError(
                _("You can't move verified reports."),
            )

    def _validate_rejected(
        self,
        review_comment,
        user,
        user_is_reviewer_on_all_reports,
        existing_db_verified,
        rejected,
    ):
        if not review_comment and rejected:
            raise exceptions.ValidationError(
                _("Review comment is required when rejecting report(s).")
            )
        if not user.is_superuser and not user_is_reviewer_on_all_reports:
            raise exceptions.ValidationError(
                _("Only reviewer and superuser can reject reports.")
            )
        if existing_db_verified and not user.is_superuser:
            raise exceptions.ValidationError(
                _("Rejecting verified reports is not allowed.")
            )

    def _validate_not_billable(self, existing_db_verified, verified, user):
        if existing_db_verified and not user.is_superuser and verified is not False:
            raise exceptions.ValidationError(
                _("You are not allowed to change not_billable on a verified report.")
            )

    def _check_verified_report_constraints(self, effective_review, user, is_reviewer):
        if effective_review:
            raise exceptions.ValidationError(
                _("Reports can't both be set as `review` and `verified`.")
            )
        if not is_reviewer and not user.is_superuser:
            raise exceptions.ValidationError(
                _("Only Reviewers and Superusers may edit verified reports.")
            )

    def cleaned_query_params(
        self, queryset: QuerySet[models.Report], request: Request
    ) -> dict:
        """Return query parameters parsed by the associated filter set."""
        filterset = self.filterset_class(
            request.query_params, queryset=queryset, request=request
        )
        filterset.is_valid()
        return filterset.form.cleaned_data

    @action(
        detail=False,
        methods=["post"],
        # all employed users are allowed to bulk update but only on filtered result
        permission_classes=[IsEmployed],
        serializer_class=serializers.ReportBulkSerializer,
    )
    def bulk(self, request):
        user = request.user
        queryset = self.filter_queryset(self.get_queryset())

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        qp = self.cleaned_query_params(queryset, request)

        if not user.is_superuser and not qp["editable"]:
            raise exceptions.ValidationError(
                _("Editable filter needs to be set for bulk update")
            )

        verified: bool | None = serializer.validated_data.pop("verified", None)

        fields = {
            key: value
            for key, value in serializer.validated_data.items()
            # value equal None means do not touch
            if value is not None
        }

        is_superuser_or_accountant = user.is_superuser or user.is_accountant
        has_billed_flag = fields.get("billed") is not None

        if has_billed_flag and not is_superuser_or_accountant:
            raise exceptions.ValidationError(
                _("Only superuser and accountants may bill reports")
            )

        reviewer_conditions = (
            Q(user__in=user.supervisees.all())
            | Q(
                task__task_assignees__user=user,
                task__task_assignees__is_reviewer=True,
            )
            | Q(
                task__project__project_assignees__user=user,
                task__project__project_assignees__is_reviewer=True,
            )
            | Q(
                task__project__customer__customer_assignees__user=user,
                task__project__customer__customer_assignees__is_reviewer=True,
            )
        )
        # Check if any reports exist outside of the reviewer conditions
        user_is_reviewer_on_all_reports = not queryset.exclude(
            reviewer_conditions
        ).exists()

        existing_db_verified = queryset.filter(verified_by__isnull=False).exists()

        existing_db_rejected = queryset.filter(rejected=True).exists()

        if fields.get("not_billable") is not None:
            self._validate_not_billable(existing_db_verified, verified, user)

        if verified is not None:
            self._validate_verified(
                user,
                can_verify=user_is_reviewer_on_all_reports,
                existing_db_rejected=existing_db_rejected,
            )
            fields["verified_by"] = (verified and user) or None

            existing_db_verified = verified

        review = serializer.validated_data.get("review")

        effective_review = (
            review if review is not None else queryset.filter(review=True).exists()
        )

        if existing_db_verified:
            self._check_verified_report_constraints(
                effective_review, user, user_is_reviewer_on_all_reports
            )

        review_comment = fields.pop("review_comment", "")

        rejected = fields.get("rejected")
        if rejected is not None:
            self._validate_rejected(
                review_comment,
                user,
                user_is_reviewer_on_all_reports,
                existing_db_verified,
                rejected,
            )

        if "task" in fields:
            self._validate_task(
                queryset,
                fields,
                review_comment,
                existing_db_verified=existing_db_verified,
            )
            # unreject report if task has changed
            fields["rejected"] = False
            fields["billed"] = bool(fields["task"].project.billed)

        if fields:
            notify_args = (queryset, fields, user, review_comment)
            tasks.notify_user_changed_reports(
                *notify_args, rejected=fields.get("rejected")
            )
            queryset.update(**fields)

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=["get"], detail=False)
    def export(self, request):
        """Export filtered reports to given file format."""
        queryset = self.get_queryset().select_related(
            "task__project__billing_type",
            "task__cost_center",
            "task__project__cost_center",
        )
        queryset = self.filter_queryset(queryset)
        queryset = queryset.annotate(
            cost_center=Case(
                # Task cost center has precedence over project cost center
                When(
                    task__cost_center__isnull=False, then=F("task__cost_center__name")
                ),
                When(
                    task__project__cost_center__isnull=False,
                    then=F("task__project__cost_center__name"),
                ),
                default=Value(""),
                output_field=CharField(),
            )
        )
        queryset = queryset.annotate(
            billing_type=Case(
                When(
                    task__project__billing_type__isnull=False,
                    then=F("task__project__billing_type__name"),
                ),
                default=Value(""),
                output_field=CharField(),
            )
        )
        if (
            settings.REPORTS_EXPORT_MAX_COUNT > 0
            and queryset.count() > settings.REPORTS_EXPORT_MAX_COUNT
        ):
            return Response(
                _("Your request exceeds the maximum allowed entries ({} > {})").format(
                    queryset.count(), settings.REPORTS_EXPORT_MAX_COUNT
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )

        colnames = [
            "Date",
            "Duration",
            "Customer",
            "Project",
            "Task",
            "User",
            "Comment",
            "Billing Type",
            "Cost Center",
        ]

        content = queryset.values_list(
            "date",
            "duration",
            "task__project__customer__name",
            "task__project__name",
            "task__name",
            "user__username",
            "comment",
            "billing_type",
            "cost_center",
        )

        file_type = request.query_params.get("file_type")
        if file_type not in ["csv", "xlsx", "ods"]:
            return HttpResponseBadRequest()

        sheet = django_excel.p.Sheet(content, name="Report", colnames=colnames)
        return django_excel.make_response(
            sheet, file_type=file_type, file_name=f"report.{file_type}"
        )

    @action(
        detail=True,
        methods=["post"],
        serializer_class=serializers.ReportSplitSerializer,
    )
    def split(self, request, pk):
        # TODO: how to save original_report to later send mail with the infos
        original_updated_report = self.get_object()
        original_report = deepcopy(original_updated_report)

        serializer = self.get_serializer(data=request.data, context={"pk": pk})
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        updated_original_report = data["updated_original_report"]
        second_report = data["second_report"]

        second_report_task = second_report["task"]
        updated_original_report_task = updated_original_report["task"]

        try:
            with transaction.atomic():
                report = models.Report(
                    comment=second_report["comment"],
                    duration=second_report["duration"],
                    task_id=second_report_task.pk,
                    not_billable=second_report["not_billable"],
                    review=second_report["review"],
                    billed=second_report_task.project.billed,
                    date=original_report.date,
                    user=original_report.user,
                )

                original_updated_report.comment = updated_original_report["comment"]
                original_updated_report.duration = updated_original_report["duration"]
                original_updated_report.not_billable = updated_original_report[
                    "not_billable"
                ]
                original_updated_report.review = updated_original_report["review"]
                original_updated_report.task_id = updated_original_report_task.pk
                original_updated_report.billed = (
                    updated_original_report_task.project.billed
                )

                original_updated_report.save()
                report.save()
        except DatabaseError:
            return Response(
                _("Something went wrong while splitting up report with id: %s")
                % original_report.pk,
                status=status.HTTP_409_CONFLICT,
            )
        comment = data["comment"]
        reviewer = request.user
        tasks.notify_user_split_report(
            original_report, original_updated_report, report, reviewer, comment
        )
        return Response(status=status.HTTP_200_OK)


class AbsenceViewSet(ModelViewSet):
    """Absence view set."""

    serializer_class = serializers.AbsenceSerializer
    filterset_class = filters.AbsenceFilterSet
    permission_classes = (
        (
            # superuser can change all but not delete
            IsAuthenticated & IsSuperUser & IsNotDelete
            # owner may change all its absences
            | IsAuthenticated & IsOwner & IsInternal
            # all authenticated users may read filtered result
            | IsAuthenticated & IsReadOnly
        ),
    )

    def get_queryset(self) -> QuerySet[models.Absence]:
        """Get absences only for internal employees.

        User should be able to create an absence on a public holiday if the
        public holiday is only on user's previous employment location.
        """
        user = self.request.user
        if user.is_superuser:
            return models.Absence.objects.select_related("absence_type", "user")

        return (
            models.Absence.objects.select_related("absence_type", "user")
            .filter(Q(user=user) | Q(user__in=user.supervisees.all()))
            .exclude(
                date__in=PublicHoliday.objects.filter(
                    location=user.get_active_employment().location
                ).values("date")
            )
        )
