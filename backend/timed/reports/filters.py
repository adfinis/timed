from __future__ import annotations

from datetime import timedelta

from django.db.models import Case, Exists, F, OuterRef, Q, QuerySet, Sum, Value, When
from django.db.models.functions import Coalesce
from django_filters import utils
from django_filters.rest_framework import (
    CharFilter,
    DateFilter,
    DjangoFilterBackend,
    FilterSet,
    NumberFilter,
)

from timed.projects.filters import TaskFilterSet
from timed.tracking.filters import CostCenterFilter, ReportFilterSet


class NOOPFilter(CharFilter):
    def filter(self, qs, value):
        return qs


class ReportStatisticFilterset(FilterSet):
    user = NumberFilter(field_name="user")
    customer = NumberFilter(field_name="customer_id")
    from_date = DateFilter(field_name="date", lookup_expr="gte")
    to_date = DateFilter(field_name="date", lookup_expr="lte")
    cost_center = CostCenterFilter(task_prefix="task")
    reviewer = NumberFilter(method="filter_reviewer")

    def filter_reviewer(self, qs, name, value):
        return ReportFilterSet.filter_has_reviewer(self, qs, name, value)


class OrgReportFilterset(FilterSet):
    """Base class for organisational filtersets (customer, project, task).

    These have in common that none of the report-specific things can be
    filtered, so instead of copy-pasting noop filters everywhere, we collect
    them here
    """

    user = NOOPFilter()
    from_date = NOOPFilter()
    to_date = NOOPFilter()
    cost_center = NOOPFilter()
    reviewer = NOOPFilter()


class CustomerReportStatisticFilterSet(OrgReportFilterset):
    customer = NumberFilter(field_name="pk")


class StatisticSecondaryFilterBackend(DjangoFilterBackend):
    # Special statistic filter backend. Turn

    def get_filterset_class(self, view, queryset=None):
        return view.secondary_filterset_class

    def filter_queryset(self, request, queryset, view):
        secondary_filterset = self.get_filterset(request, view.secondary_queryset, view)

        if not secondary_filterset.is_valid() and self.raise_exception:
            raise utils.translate_validation(secondary_filterset.errors)

        secondary_qs = secondary_filterset.qs

        queryset = (
            queryset.filter(**{view.secondary_link_field: OuterRef("pk")})
            .values(view.secondary_link_field)
            .annotate(duration=Sum("duration"))
        )

        return secondary_qs.annotate(duration=Sum(queryset.values("duration")))
