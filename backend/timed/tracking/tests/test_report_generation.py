"""
Tests for Report Generation from Activties
"""

from __future__ import annotations

import datetime
from datetime import time, timedelta
from functools import partial
from operator import attrgetter
from typing import TYPE_CHECKING

import pytest
from django.urls import reverse
from pytest_lazy_fixtures import lfc
from rest_framework import status

from timed.tracking.models import Activity, Report

if TYPE_CHECKING:
    from conftest import AuthenticatedAPIClient
    from timed.employment.models import User
    from timed.projects.factories import TaskFactory
    from timed.projects.models import Task
    from timed.tracking.factories import ActivityFactory, ReportFactory


fields = ("comment", "task", "date", "review", "not_billable", "user")

extract_attributes = attrgetter(*fields)
"""Callable to extract shared attributes/fields from Reports and/or Activities."""


@pytest.fixture(autouse=True)
def configure_test_client_format(internal_employee_client):
    prev = internal_employee_client.default_format
    internal_employee_client.default_format = "json"
    yield
    # restore previous value on teardown
    internal_employee_client.default_format = prev


@pytest.mark.parametrize("activity__from_time", [time(10, 30)])
@pytest.mark.parametrize("activity__to_time", [time(11, 30)])
def test_can_generate_reports(
    internal_employee_client: AuthenticatedAPIClient, activity: Activity
) -> None:
    """AT06"""

    user = internal_employee_client.user
    activity.user = user
    activity.save()

    assert activity.transferred is False
    assert Report.objects.count() == 0
    assert Activity.objects.count() == 1

    url = reverse("report-generate")

    resp = internal_employee_client.post(url, data={"date": str(activity.date)})
    assert resp.status_code == status.HTTP_204_NO_CONTENT
    activity.refresh_from_db()

    assert activity.transferred is True

    assert Report.objects.count() == 1

    report = Report.objects.first()
    assert report.duration == timedelta(hours=1)

    assert extract_attributes(report) == extract_attributes(activity)


@pytest.mark.parametrize(
    "activity_to_skip",
    [
        pytest.param(lfc("activity_factory", transferred=True), id="transferred"),
        pytest.param(lfc("activity_factory", task=None), id="no-task"),
    ],
)
def test_skips_certain_activities(
    internal_employee_client: AuthenticatedAPIClient,
    activity_to_skip: Activity,
    activity_factory: type[ActivityFactory],
    task: Task,
):
    """AT07, AT08"""
    user = internal_employee_client.user

    activity_to_skip.user = user
    activity_to_skip.save()

    other_activity = activity_factory(user=user, date=activity_to_skip.date, task=task)

    assert Report.objects.count() == 0
    assert Activity.objects.count() == 2

    url = reverse("report-generate")

    resp = internal_employee_client.post(url, data={"date": str(activity_to_skip.date)})
    assert resp.status_code == status.HTTP_204_NO_CONTENT

    other_activity.refresh_from_db()

    assert Report.objects.count() == 1
    assert other_activity.transferred is True

    report = Report.objects.first()

    assert extract_attributes(other_activity) == extract_attributes(report)


@pytest.mark.django_db
@pytest.mark.freeze_time("2026-11-01")
@pytest.mark.parametrize("activity__date", [datetime.date(2026, 11, 1)])
@pytest.mark.parametrize("activity__to_time", [None])
class TestRunningActivities:
    def test_handles_running_activity(
        self,
        internal_employee_client: AuthenticatedAPIClient,
        activity: Activity,
        activity_factory: type[ActivityFactory],
    ) -> None:
        """AT09"""

        user = internal_employee_client.user
        activity.user = user
        activity.save()

        other_activity = activity_factory(user=user, date=activity.date)

        assert activity.to_time is None, "the activity is not active"
        assert other_activity.to_time is not None
        assert extract_attributes(activity) != extract_attributes(other_activity)

        assert Activity.objects.count() == 2
        assert Report.objects.count() == 0

        url = reverse("report-generate")
        resp = internal_employee_client.post(url, data={"date": str(activity.date)})
        assert resp.status_code == status.HTTP_204_NO_CONTENT

        assert Report.objects.count() == 2
        assert Activity.objects.count() == 3
        assert Activity.objects.filter(transferred=True).count() == 2

        activity.refresh_from_db()
        assert activity.transferred is True
        assert activity.to_time is not None

        activity_from_db = Activity.objects.get(transferred=False)

        assert activity_from_db.to_time is None, "the activity is not active"
        assert activity_from_db.from_time == activity.to_time, "not contiguous"
        # NOTE: the frontend really doesn't like these, and we don't really need this sort of precision anyways
        assert activity_from_db.from_time.microsecond == 0, (
            "microseconds were not discarded"
        )

        assert extract_attributes(activity) == extract_attributes(activity_from_db)

    @pytest.mark.parametrize("other_date", [datetime.date(2026, 12, 1)])
    def test_running_activty_not_changed_when_generating_for_other_date(
        self,
        internal_employee_client: AuthenticatedAPIClient,
        activity: Activity,
        other_date: datetime.date,
    ) -> None:
        """AT10"""
        user = internal_employee_client.user
        activity.user = user
        activity.save()

        assert activity.date != other_date
        assert Activity.objects.count() == 1
        assert Report.objects.count() == 0

        url = reverse("report-generate")
        resp = internal_employee_client.post(url, data={"date": str(other_date)})
        assert resp.status_code == status.HTTP_204_NO_CONTENT

        assert Activity.objects.count() == 1
        assert Report.objects.count() == 0

        activity_from_db = Activity.objects.first()

        assert extract_attributes(activity) == extract_attributes(activity_from_db), (
            "some attributes were changed"
        )
        assert activity_from_db.to_time is None, "activity is no longer running"

    @pytest.mark.parametrize("activity__task", [None])
    def test_running_activity_not_disrupted_when_invalid(
        self,
        internal_employee_client: AuthenticatedAPIClient,
        activity: Activity,
    ) -> None:
        """AT11"""
        user = internal_employee_client.user
        activity.user = user
        activity.save()

        assert Activity.objects.count() == 1
        assert Report.objects.count() == 0

        url = reverse("report-generate")
        resp = internal_employee_client.post(url, data={"date": str(activity.date)})
        assert resp.status_code == status.HTTP_204_NO_CONTENT

        assert Activity.objects.count() == 1
        assert Report.objects.count() == 0

        activity_from_db = Activity.objects.first()

        assert extract_attributes(activity) == extract_attributes(activity_from_db), (
            "no attributes were changed"
        )
        assert activity_from_db.to_time is None, "activity is still running"

    def test_handles_running_activity_started_on_past_date(
        self,
        internal_employee_client: AuthenticatedAPIClient,
        activity: Activity,
    ) -> None:
        """
        Test that we do not upate running activities that were started on another day.
        This is a rare edge case, and we just need to ensure that we do not engage with it.

        If we consider this being used on another day, and `now().time()` being used, from_time could be > to_time.

        Actual handling for such activities is in `ActivitySerializer.update`.
        """

        user = internal_employee_client.user
        activity.user = user
        activity.date = activity.date - timedelta(days=1)
        activity.save()

        assert activity.to_time is None, "the activity is still running"

        assert Activity.objects.count() == 1
        assert Report.objects.count() == 0

        url = reverse("report-generate")
        resp = internal_employee_client.post(url, data={"date": str(activity.date)})
        assert resp.status_code == status.HTTP_204_NO_CONTENT

        assert Report.objects.count() == 0
        assert Activity.objects.count() == 1

        activity.refresh_from_db()
        assert activity.transferred is False
        assert activity.to_time is None


def test_combines_activities(
    internal_employee_client: AuthenticatedAPIClient,
    activity: Activity,
    task_factory: type[TaskFactory],
    activity_factory: type[ActivityFactory],
):
    """AT12"""

    user = internal_employee_client.user
    activity.user = user
    activity.save()

    task = task_factory()
    assert activity.task != task

    activity_factory.create_batch(
        2, user=user, date=activity.date, task=task, comment="foo"
    )

    assert Activity.objects.count() == 3
    assert Report.objects.count() == 0

    url = reverse("report-generate")
    resp = internal_employee_client.post(url, data={"date": str(activity.date)})
    assert resp.status_code == status.HTTP_204_NO_CONTENT

    assert Report.objects.count() == 2
    assert Activity.objects.filter(transferred=True).count() == 3


@pytest.mark.parametrize("date", [datetime.date(2026, 11, 1)])
def test_merges_into_existing_reports(
    internal_employee_client: AuthenticatedAPIClient,
    activity_factory: type[ActivityFactory],
    report_factory: type[ReportFactory],
    task: Task,
    date: datetime.date,
):
    """AT13"""
    user = internal_employee_client.user

    kwargs = {"user": user, "date": date, "task": task}
    create_report = partial(report_factory, duration=timedelta(minutes=30), **kwargs)
    create_activity = partial(activity_factory, **kwargs)

    # we create three 30 minute reports
    verified_report = create_report(comment="john verified", verified_by=user)
    report = create_report(comment="just some report")
    other_report = create_report(comment="another one")

    # we create one activity that spans 5 minutes
    # that has the same attributes as `verified_report`
    create_activity(
        from_time=time(8, 10), to_time=time(8, 15), comment=verified_report.comment
    )

    # we create another activity that spans 5 minutes
    # but that has the same attributes as `report`
    create_activity(from_time=time(8, 20), to_time=time(8, 25), comment=report.comment)

    # we create a last activity that spans 10 minutes
    # and has the same attributes as `other_report`
    create_activity(
        from_time=time(8, 30), to_time=time(8, 40), comment=other_report.comment
    )

    assert Report.objects.count() == 3
    assert Activity.objects.count() == 3

    url = reverse("report-generate")
    resp = internal_employee_client.post(url, data={"date": str(date)})
    assert resp.status_code == status.HTTP_204_NO_CONTENT

    # activities with the same attributes as `report` and `other_report`
    # were merged into `report`/`other_report` (no new reports from these)

    # a new report was created for the activity with the same attributes as `verified_report`
    # because verified reports do not get modified/mutated/merged into
    assert Report.objects.count() == 4
    assert Activity.objects.count() == 3

    report.refresh_from_db()
    other_report.refresh_from_db()

    # 35 (30 + 5) minutes gets rounded down to 30 minutes
    assert report.duration == timedelta(minutes=30)
    # 40 (30 + 10) minutes gets rounded up to 45 minutes
    assert other_report.duration == timedelta(minutes=45)

    # 5 minutes gets rounded up to 15 minutes
    new_report = Report.objects.get(
        comment=verified_report.comment, verified_by__isnull=True
    )
    assert new_report.duration == timedelta(minutes=15)


@pytest.mark.parametrize("date", [datetime.date(2026, 11, 1)])
def test_rounding_happens_after_summing_activities(
    internal_employee_client: AuthenticatedAPIClient,
    activity_factory: type[ActivityFactory],
    task: Task,
    date: datetime.date,
):
    """AT14"""
    user = internal_employee_client.user

    create_activity = partial(activity_factory, user=user, date=date, task=task)

    # we create activities that only differ by these two comments
    comment1, comment2 = "foo", "bar"

    # create 2 activities spanning 5 minutes
    create_activity(comment=comment1, from_time=time(8, 15), to_time=time(8, 20))
    create_activity(comment=comment1, from_time=time(8, 21), to_time=time(8, 26))

    # create 3 activities, spanning 20, 10 and/or 15 minutes respectively
    create_activity(comment=comment2, from_time=time(8, 30), to_time=time(8, 50))
    create_activity(comment=comment2, from_time=time(9, 10), to_time=time(9, 20))
    create_activity(comment=comment2, from_time=time(9, 30), to_time=time(9, 45))

    assert Activity.objects.count() == 5
    assert Activity.objects.filter(transferred=False).count() == 5

    url = reverse("report-generate")
    resp = internal_employee_client.post(url, data={"date": str(date)})

    assert resp.status_code == status.HTTP_204_NO_CONTENT

    assert Report.objects.count() == 2, "created wrong amount of reports"
    assert Activity.objects.filter(transferred=True).count() == 5, (
        "not all activities were transferred"
    )

    report_1 = Report.objects.get(comment=comment1)
    report_2 = Report.objects.get(comment=comment2)

    assert report_1.duration == timedelta(minutes=15), "round(5min + 5min) != 15min"
    assert report_2.duration == timedelta(minutes=45), (
        "round(20min + 10min + 15min) != 45 min"
    )


def test_can_only_generate_from_own_activities(
    internal_employee_client: AuthenticatedAPIClient,
    activity: Activity,
    user: User,
):
    """AT15"""
    assert user != internal_employee_client.user
    activity.user = user
    activity.save()

    # the date from the factory is stored as a string
    # if we compare against something from the db later we run into
    # a failure because `date(y,m,d) != "YYYY-MM-DD"`, so we refresh here
    activity.refresh_from_db()

    assert Activity.objects.count() == 1
    assert Report.objects.count() == 0

    url = reverse("report-generate")
    resp = internal_employee_client.post(url, data={"date": str(activity.date)})

    assert resp.status_code == status.HTTP_204_NO_CONTENT

    activity_from_db = Activity.objects.get(id=activity.pk)
    assert Report.objects.count() == 0
    assert activity_from_db.transferred is False
    assert extract_attributes(activity_from_db) == extract_attributes(activity)


@pytest.mark.parametrize(
    "date", ["foo", "not-a-date", "2026-13-14", 2, {"also": "not-a-date"}]
)
def test_gracefully_rejects_invalid_dates(
    internal_employee_client: AuthenticatedAPIClient,
    date,
):
    url = reverse("report-generate")
    resp = internal_employee_client.post(url, data={"date": date})

    assert resp.status_code == status.HTTP_400_BAD_REQUEST
