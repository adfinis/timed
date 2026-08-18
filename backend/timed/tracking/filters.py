"""Filters for filtering the data of the tracking app endpoints."""

from __future__ import annotations

from typing import TYPE_CHECKING

from django.contrib.postgres.search import SearchQuery
from django.db.models import Q
from django_filters.rest_framework import (
    BooleanFilter,
    CharFilter,
    DateFilter,
    FilterSet,
)

from timed.filters import IdFilter, IdInFilter
from timed.projects.models import CustomerAssignee, ProjectAssignee, TaskAssignee
from timed.tracking import models

if TYPE_CHECKING:
    from django.db.models import QuerySet


class ActivityFilterSet(FilterSet):
    """Filter set for the activities endpoint."""

    active = BooleanFilter(method="filter_active")
    day = DateFilter(field_name="date")

    def filter_active(
        self,
        qs: QuerySet[models.Activity],
        _name: str,
        value: bool,  # noqa: FBT001
    ) -> QuerySet[models.Activity]:
        """Filter activities by being currently active or not."""
        active_activities = Q(to_time__exact=None)
        if not value:
            return qs.exclude(active_activities)
        return qs.filter(active_activities)

    class Meta:
        """Meta information for the activity filter set."""

        model = models.Activity
        fields = (
            "active",
            "day",
        )


class AttendanceFilterSet(FilterSet):
    """Filter set for the attendance endpoint."""

    class Meta:
        """Meta information for the attendance filter set."""

        model = models.Attendance
        fields = ("date",)


class ReportFilterSet(FilterSet):
    """Filter set for the reports endpoint."""

    id = IdInFilter()
    from_date = DateFilter(field_name="date", lookup_expr="gte")
    to_date = DateFilter(field_name="date", lookup_expr="lte")
    project = IdFilter(field_name="task__project")
    customer = IdFilter(field_name="task__project__customer")
    review = BooleanFilter()
    editable = BooleanFilter(method="filter_editable")
    not_billable = BooleanFilter()
    billed = BooleanFilter()
    verified = BooleanFilter(
        field_name="verified_by_id", lookup_expr="isnull", exclude=True
    )
    reviewer = IdFilter(method="filter_has_reviewer")
    verifier = IdFilter(field_name="verified_by")
    billing_type = IdFilter(field_name="task__project__billing_type")
    user = IdFilter(field_name="user_id")
    cost_center = IdFilter(method="filter_cost_center")

    rejected = BooleanFilter()
    comment = CharFilter(method="filter_comment")

    def filter_has_reviewer(
        self, queryset: QuerySet[models.Report], _name: str, value: int
    ) -> QuerySet[models.Report]:
        if not value:  # pragma: no cover
            return queryset

        # reports in which user is customer assignee and responsible reviewer
        reports_customer_assignee_is_reviewer = queryset.filter(
            Q(
                task__project__customer_id__in=CustomerAssignee.objects.filter(
                    is_reviewer=True, user_id=value
                ).values("customer_id")
            )
        ).exclude(
            Q(
                task__project_id__in=ProjectAssignee.objects.filter(
                    is_reviewer=True
                ).values("project_id")
            )
            | Q(
                task_id__in=TaskAssignee.objects.filter(is_reviewer=True).values(
                    "task_id"
                )
            )
        )

        # reports in which user is project assignee and responsible reviewer
        reports_project_assignee_is_reviewer = queryset.filter(
            Q(
                task__project_id__in=ProjectAssignee.objects.filter(
                    is_reviewer=True, user_id=value
                ).values("project_id")
            )
        ).exclude(
            Q(
                task_id__in=TaskAssignee.objects.filter(is_reviewer=True).values(
                    "task_id"
                )
            )
        )

        # reports in which user task assignee and responsible reviewer
        reports_task_assignee_is_reviewer = queryset.filter(
            Q(
                task_id__in=TaskAssignee.objects.filter(
                    is_reviewer=True, user_id=value
                ).values("task_id")
            )
        )

        return (
            reports_customer_assignee_is_reviewer
            | reports_project_assignee_is_reviewer
            | reports_task_assignee_is_reviewer
        )

    def filter_editable(
        self,
        queryset: QuerySet[models.Report],
        _name: str,
        value: bool,  # noqa: FBT001
    ) -> QuerySet[models.Report]:
        """Filter reports whether they are editable by current user.

        When set `True` filter all results to what is editable by current
        user. If set to `False` to not editable.
        """
        user = self.request.user
        assignee_filter = (
            # avoid duplicates by using subqueries instead of joins
            Q(user__in=user.supervisees.values("id"))
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
            | Q(user=user)
        )
        unfinished_filter = Q(verified_by__isnull=True)
        editable_filter = assignee_filter & unfinished_filter

        if value:  # editable
            if user.is_superuser:
                # superuser may edit all reports
                return queryset
            if user.is_accountant:
                return queryset.filter(unfinished_filter)
            # only owner, reviewer or supervisor may change unverified reports
            return queryset.filter(editable_filter).distinct()

        # not editable
        if user.is_superuser:
            # no reports which are not editable
            return queryset.none()
        if user.is_accountant:
            return queryset.exclude(unfinished_filter)

        return queryset.exclude(editable_filter)

    def filter_cost_center(
        self, queryset: QuerySet[models.Report], _name: str, value: int
    ) -> QuerySet[models.Report]:
        """Filter report by cost center.

        Cost center on task has higher priority over project cost
        center.
        """
        return queryset.filter(
            Q(task__cost_center=value)
            | Q(task__project__cost_center=value) & Q(task__cost_center__isnull=True)
        )

    def filter_comment(
        self, queryset: QuerySet[models.Report], _name: str, value: str
    ) -> QuerySet[models.Report]:
        return queryset.filter(search_vector=SearchQuery(value, config="english"))

    class Meta:
        """Meta information for the report filter set."""

        model = models.Report
        fields = (
            "date",
            "from_date",
            "to_date",
            "user",
            "task",
            "project",
            "verified",
            "not_billable",
            "review",
            "reviewer",
            "billing_type",
        )


class AbsenceFilterSet(FilterSet):
    """Filter set for the absences endpoint."""

    from_date = DateFilter(field_name="date", lookup_expr="gte")
    to_date = DateFilter(field_name="date", lookup_expr="lte")

    class Meta:
        """Meta information for the absence filter set."""

        model = models.Absence
        fields = (
            "date",
            "from_date",
            "to_date",
            "user",
        )
