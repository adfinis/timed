from datetime import timedelta

from django.db.models import Sum
from django.utils.duration import duration_string

from timed.tracking.filters import ReportFilterSet


class TotalTimeRootMetaMixin:
    duration_field = "duration"

    def get_root_meta(self, resource, many):
        """Add total hours over whole result (not just page) to meta."""
        meta = (
            super().get_root_meta(resource, many)
            if hasattr(super(), "get_root_meta")
            else {}
        )
        aggregate_list = {"total_time": Sum(self.duration_field)}
        if "estimated_time" in self.fields:
            aggregate_list["total_estimated_time"] = Sum("estimated_time")
        if "total_remaining_effort" in self.fields:
            aggregate_list["total_remaining_effort"] = Sum("total_remaining_effort")
        if "most_recent_remaining_effort" in self.fields:
            aggregate_list["total_remaining_effort"] = Sum(
                "most_recent_remaining_effort"
            )
        if many:
            view = self.context["view"]
            queryset = view.filter_queryset(view.get_queryset())
            data = queryset.aggregate(**aggregate_list)
            meta["total_time"] = duration_string(data["total_time"] or timedelta(0))
            if "total_estimated_time" in aggregate_list:
                meta["total_estimated_time"] = duration_string(
                    data["total_estimated_time"] or timedelta(0)
                )
            if "total_remaining_effort" in aggregate_list:
                meta["total_remaining_effort"] = duration_string(
                    data["total_remaining_effort"] or timedelta(0)
                )
        return meta


class CanEditAllRootMetaMixin:
    def get_root_meta(self, resource, many):
        meta = (
            super().get_root_meta(resource, many)
            if hasattr(super(), "get_root_meta")
            else {}
        )
        view = self.context["view"]
        queryset = view.filter_queryset(view.get_queryset())
        filtered_queryset = ReportFilterSet.filter_editable(
            view, queryset=queryset, _name="foobar", value=True
        )
        meta["can_edit_all"] = not queryset.exclude(pk__in=filtered_queryset).exists()
        return meta


class AggregateObject(dict):
    """Wrap dict into an object.

    All values will be accessible through attributes. Note that
    keys must be valid python names for this to work.
    """

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)
        super().__init__(**kwargs)
