"""Serializers for the reports app."""

from __future__ import annotations

from datetime import timedelta
from typing import TYPE_CHECKING

from django.contrib.auth import get_user_model
from rest_framework_json_api import relations
from rest_framework_json_api.serializers import (
    CharField,
    DecimalField,
    DurationField,
    IntegerField,
    Serializer,
)

from timed.projects.models import Customer, Project
from timed.serializers import TotalTimeRootMetaMixin

if TYPE_CHECKING:
    from typing import ClassVar


class ReportDurationField(DurationField):
    """Custom duration field, to turn None into 00:00:00.

    We don't wanna complicate the query any more than neccessary, and
    cast the NULL durations into something else on DB level. Let's just
    do it at deserialisation time instead.
    """

    # TODO: this shouldn't be needed, for total_time calc we still need
    # the *numbers* in the QS

    def to_representation(self, value):
        if value is None:
            value = timedelta(seconds=0)
        return super().to_representation(value)


class YearStatisticSerializer(TotalTimeRootMetaMixin, Serializer):
    duration = DurationField(read_only=True)
    year = IntegerField()

    class Meta:
        resource_name = "year-statistics"


class MonthStatisticSerializer(TotalTimeRootMetaMixin, Serializer):
    duration = DurationField(read_only=True)
    year = IntegerField()
    month = IntegerField()

    class Meta:
        resource_name = "month-statistics"


class CustomerStatisticSerializer(TotalTimeRootMetaMixin, Serializer):
    duration = DurationField(read_only=True)
    name = CharField(read_only=True)

    class Meta:
        resource_name = "customer-statistics"


class ProjectStatisticSerializer(TotalTimeRootMetaMixin, Serializer):
    duration = DurationField(read_only=True)
    name = CharField(source="project__name")
    amount_offered = DecimalField(max_digits=None, decimal_places=2)
    amount_offered_currency = CharField()
    amount_invoiced = DecimalField(max_digits=None, decimal_places=2)
    amount_invoiced_currency = CharField()
    customer = relations.ResourceRelatedField(model=Customer, read_only=True)
    estimated_time = DurationField(read_only=True)
    total_remaining_effort = DurationField(read_only=True)

    included_serializers: ClassVar[dict[str, str]] = {
        "customer": "timed.projects.serializers.CustomerSerializer"
    }

    class Meta:
        resource_name = "project-statistics"


class TaskStatisticSerializer(TotalTimeRootMetaMixin, Serializer):
    name = CharField(read_only=True)
    most_recent_remaining_effort = DurationField(read_only=True)
    duration = DurationField(read_only=True)
    project = relations.ResourceRelatedField(model=Project, read_only=True)
    estimated_time = DurationField(read_only=True)

    included_serializers: ClassVar[dict[str, str]] = {
        "project": "timed.projects.serializers.ProjectSerializer"
    }

    class Meta:
        resource_name = "task-statistics"


class UserStatisticSerializer(TotalTimeRootMetaMixin, Serializer):
    duration = DurationField(read_only=True)
    user = relations.ResourceRelatedField(model=get_user_model(), read_only=True)

    included_serializers: ClassVar[dict[str, str]] = {
        "user": "timed.employment.serializers.UserSerializer"
    }

    class Meta:
        resource_name = "user-statistics"
