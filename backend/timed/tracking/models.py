"""Models for the tracking app."""

from __future__ import annotations

from datetime import timedelta
from typing import TYPE_CHECKING

from django.conf import settings
from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.search import SearchVectorField
from django.db import models

from timed.utils import round_timedelta

if TYPE_CHECKING:
    from timed.employment.models import Employment


class Activity(models.Model):
    """Activity model.

    An activity represents a timeblock in which a user worked on a
    certain task.
    """

    from_time = models.TimeField()
    to_time = models.TimeField(blank=True, null=True)
    comment = models.TextField(blank=True)
    date = models.DateField()
    transferred = models.BooleanField(default=False)
    review = models.BooleanField(default=False)
    not_billable = models.BooleanField(default=False)
    task = models.ForeignKey(
        "projects.Task",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="activities",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="activities"
    )

    class Meta:
        """Meta informations for the activity model."""

        verbose_name_plural = "activities"
        indexes = (models.Index(fields=["date"]),)

    def __str__(self) -> str:
        """Represent the model as a string."""
        return f"{self.user}: {self.task}"


class Attendance(models.Model):
    """Attendance model.

    An attendance is a timespan in which a user was present at work.
    Timespan should not be time zone aware hence splitting into date and
    from resp. to time fields.
    """

    date = models.DateField()
    from_time = models.TimeField()
    to_time = models.TimeField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="attendances"
    )

    def __str__(self) -> str:
        """Represent the model as a string."""
        return f"{self.user}: {self.date:%Y-%m-%d} {self.from_time:%H:%M} - {self.to_time:%H:%M}"


class Report(models.Model):
    """Report model.

    A report is a timespan in which a user worked on a certain task.
    The difference to the activity is, that this is going to be on the
    bill for the customer.
    """

    comment = models.TextField(blank=True)
    date = models.DateField()
    duration = models.DurationField()
    review = models.BooleanField(default=False)
    not_billable = models.BooleanField(default=False)
    billed = models.BooleanField(default=False)
    task = models.ForeignKey(
        "projects.Task", on_delete=models.PROTECT, related_name="reports"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="reports"
    )
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    rejected = models.BooleanField(default=False)
    remaining_effort = models.DurationField(default=timedelta(0), null=True)

    search_vector = SearchVectorField(null=True)

    class Meta:
        """Meta information for the report model."""

        indexes = (
            models.Index(fields=["date"]),
            GinIndex(fields=["search_vector"]),
        )

    def __str__(self) -> str:
        """Represent the model as a string."""
        return f"{self.user}: {self.task}"

    def save(self, *args, **kwargs) -> None:  # noqa: ANN002,ANN003
        """Save the report with some custom functionality.

        This rounds the duration of the report to the nearest 15 minutes.
        However, the duration must at least be 15 minutes long.
        """
        self.duration = round_timedelta(self.duration)

        super().save(*args, **kwargs)


class Absence(models.Model):
    """Absence model.

    An absence is time an employee was not working but still counts as
    worktime. E.g holidays or sickness.
    """

    comment = models.TextField(blank=True)
    date = models.DateField()
    absence_type = models.ForeignKey(
        "employment.AbsenceType", on_delete=models.PROTECT, related_name="absences"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="absences"
    )

    class Meta:
        """Meta informations for the absence model."""

        unique_together = (
            "date",
            "user",
        )

    def __str__(self) -> str:
        """Represent the model as a string."""
        return f"{self.user}: {self.date:%Y-%m-%d} {self.comment}"

    def calculate_duration(self, employment: Employment) -> timedelta:
        """Calculate duration of absence with given employment.

        For fullday absences duration is equal worktime per day of employment
        for absences which need to fill day calcuation needs to check
        how much time has been reported on that day.
        """
        if not self.absence_type.fill_worktime:
            return employment.worktime_per_day

        reports = Report.objects.filter(date=self.date, user=self.user_id)
        data = reports.aggregate(reported_time=models.Sum("duration"))
        reported_time = data["reported_time"] or timedelta()
        if reported_time >= employment.worktime_per_day:
            # prevent negative duration in case user already
            # reported more time than worktime per day
            return timedelta()

        return employment.worktime_per_day - reported_time
