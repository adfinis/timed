from __future__ import annotations

from typing import TYPE_CHECKING

from django.db.models import Q
from django_filters.constants import EMPTY_VALUES
from django_filters.rest_framework import (
    BooleanFilter,
    DateFilter,
    Filter,
    FilterSet,
)

from timed.employment import models
from timed.employment.models import User
from timed.filters import IdFilter

if TYPE_CHECKING:
    from django.db.models import QuerySet


class YearFilter(Filter):
    """Filter to filter a queryset by year."""

    def filter[T: QuerySet](self, qs: T, value: int) -> T:
        if value in EMPTY_VALUES:
            return qs

        return qs.filter(**{f"{self.field_name}__year": value})


class PublicHolidayFilterSet(FilterSet):
    """Filter set for the public holidays endpoint."""

    year = YearFilter(field_name="date")
    from_date = DateFilter(field_name="date", lookup_expr="gte")
    to_date = DateFilter(field_name="date", lookup_expr="lte")

    class Meta:
        """Meta information for the public holiday filter set."""

        model = models.PublicHoliday
        fields = (
            "year",
            "location",
            "date",
            "from_date",
            "to_date",
        )


class AbsenceTypeFilterSet(FilterSet):
    fill_worktime = BooleanFilter(field_name="fill_worktime")

    class Meta:
        """Meta information for the public holiday filter set."""

        model = models.AbsenceType
        fields = ("fill_worktime",)


class UserFilterSet(FilterSet):
    active = BooleanFilter(field_name="is_active")
    supervisor = IdFilter(field_name="supervisors")
    is_reviewer = BooleanFilter(method="filter_is_reviewer")
    is_supervisor = BooleanFilter(method="filter_is_supervisor")
    is_accountant = BooleanFilter(field_name="is_accountant")
    is_external = BooleanFilter(field_name="employments__is_external")

    def filter_is_reviewer(
        self,
        queryset: QuerySet[User],
        _name: str,
        value: bool,  # noqa: FBT001
    ) -> QuerySet[User]:
        is_reviewer = Q(pk__in=User.objects.all_reviewers())
        if value:
            return queryset.filter(is_reviewer)
        return queryset.exclude(is_reviewer)

    def filter_is_supervisor(
        self,
        queryset: QuerySet[User],
        _name: str,
        value: bool,  # noqa: FBT001
    ) -> QuerySet[User]:
        is_supervisor = Q(pk__in=User.objects.all_supervisors())
        if value:
            return queryset.filter(is_supervisor)
        return queryset.exclude(is_supervisor)

    class Meta:
        model = models.User
        fields = (
            "active",
            "supervisor",
            "is_reviewer",
            "is_supervisor",
            "is_accountant",
        )


class EmploymentFilterSet(FilterSet):
    date = DateFilter(method="filter_date")

    def filter_date(
        self, queryset: QuerySet[models.Employment], _name: str, value: int
    ) -> QuerySet[models.Employment]:
        return queryset.filter(
            Q(start_date__lte=value)
            & Q(Q(end_date__gte=value) | Q(end_date__isnull=True))
        )

    class Meta:
        model = models.Employment
        fields = (
            "user",
            "location",
        )


class OvertimeCreditFilterSet(FilterSet):
    year = YearFilter(field_name="date")
    from_date = DateFilter(field_name="date", lookup_expr="gte")
    to_date = DateFilter(field_name="date", lookup_expr="lte")

    class Meta:
        model = models.OvertimeCredit
        fields = (
            "year",
            "user",
            "date",
            "from_date",
            "to_date",
        )


class AbsenceCreditFilterSet(FilterSet):
    year = YearFilter(field_name="date")
    from_date = DateFilter(field_name="date", lookup_expr="gte")
    to_date = DateFilter(field_name="date", lookup_expr="lte")

    class Meta:
        model = models.AbsenceCredit
        fields = (
            "year",
            "user",
            "date",
            "from_date",
            "to_date",
            "absence_type",
        )


class WorktimeBalanceFilterSet(FilterSet):
    user = IdFilter(field_name="id")
    supervisor = IdFilter(field_name="supervisors")

    class Meta:
        model = models.User
        fields = ("user",)


class AbsenceBalanceFilterSet(FilterSet):
    absence_type = IdFilter(field_name="id")

    class Meta:
        model = models.AbsenceType
        fields = ("absence_type",)
