from __future__ import annotations

from typing import TYPE_CHECKING

from django.urls import reverse
from rest_framework import status

from timed.tracking.models import ReportHistory

if TYPE_CHECKING:
    from django.test.client import Client
    from pytest_django import DjangoAssertNumQueries

    from timed.employment.models import User
    from timed.projects.factories import ProjectAssigneeFactory, TaskFactory
    from timed.projects.models import Customer, Project
    from timed.tracking.factories import ReportFactory, ReportHistoryFactory


def test_report_detail_include_history(
    internal_employee_client: Client,
    report_history: ReportHistory,
    report_history_factory: ReportHistoryFactory,
):
    # add some history records that should not be included/returned
    report_history_factory.create_batch(10)

    url = reverse("report-detail", args=[report_history.report.pk])
    response = internal_employee_client.get(url, query_params={"include": "history"})

    assert response.status_code == status.HTTP_200_OK
    json = response.json()
    history = json["data"]["relationships"]["history"]

    assert history["meta"]["count"] == 1
    assert history["data"][0]["id"] == str(report_history.pk)


def test_report_list_include_history(
    internal_employee_client: Client,
    report_history_factory: ReportHistoryFactory,
):
    histories = report_history_factory.create_batch(10)

    url = reverse("report-list")
    response = internal_employee_client.get(url, query_params={"include": "history"})

    assert response.status_code == status.HTTP_200_OK
    json = response.json()

    assert len(json["included"]) == len(histories)


def test_report_history_created_on_bulk_move_multiple(
    internal_employee_client: Client,
    report_factory: ReportFactory,
    user: User,
    project: Project,
    customer_factory: Customer,
    task_factory: TaskFactory,
    project_assignee_factory: ProjectAssigneeFactory,
    django_assert_num_queries: DjangoAssertNumQueries,
    snapshot: int,
):
    reviewer = internal_employee_client.user
    project_assignee_factory(project=project, user=reviewer, is_reviewer=True)
    other_customer = customer_factory()

    # sanity checks
    assert ReportHistory.objects.count() == 0
    assert project.customer != other_customer
    assert reviewer != user

    dest_task = task_factory(project__customer=project.customer)
    reports = report_factory.create_batch(1000, task__project=project, user=user)

    url = reverse("report-bulk")

    data = {
        "data": {
            "type": "report-bulks",
            "id": None,
            "attributes": {"review_comment": (review_comment := "bar foo baz.")},
            "relationships": {
                # move to other task
                "task": {"data": {"type": "tasks", "id": dest_task.pk}},
            },
        }
    }

    params = {
        "editable": 1,
        "reviewer": reviewer.pk,
        "id": ",".join([str(report.pk) for report in reports]),
    }

    # catch performance regressions
    with django_assert_num_queries(snapshot):
        response = internal_employee_client.post(url, data, query_params=params)

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert ReportHistory.objects.count() == len(reports)

    qs = ReportHistory.objects.all()
    comments = qs.values_list("comment", flat=True).distinct()
    assert len(comments) == 1
    assert comments[0] == review_comment
