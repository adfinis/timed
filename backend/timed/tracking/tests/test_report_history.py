from __future__ import annotations

from typing import TYPE_CHECKING

from django.urls import reverse
from rest_framework import status

if TYPE_CHECKING:
    from django.test.client import Client

    from timed.projects.factories import ProjectAssigneeFactory, TaskFactory
    from timed.tracking.factories import ReportHistoryFactory
    from timed.tracking.models import Report, ReportHistory


def test_report_detail_include_history(
    internal_employee_client: Client, report_history: ReportHistory
):
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


def test_report_history_created_on_bulk_move(
    internal_employee_client: Client,
    report: Report,
    task_factory: TaskFactory,
    project_assignee_factory: ProjectAssigneeFactory,
):
    reviewer = internal_employee_client.user
    project_assignee_factory(
        project=report.task.project, user=reviewer, is_reviewer=True
    )
    initial_task = report.task
    other_task = task_factory(project=initial_task.project)

    # sanity checks
    assert report.history.count() == 0
    assert other_task != initial_task

    url = reverse("report-bulk")

    data = {
        "data": {
            "type": "report-bulks",
            "id": None,
            "attributes": {"review_comment": (review_comment := "foo bar baz.")},
            "relationships": {
                # move to other task
                "task": {"data": {"type": "tasks", "id": other_task.pk}},
            },
        }
    }

    params = {"editable": 1, "reviewer": reviewer.pk, "id": report.pk}
    response = internal_employee_client.post(url, data, query_params=params)
    assert response.status_code == status.HTTP_204_NO_CONTENT

    assert report.history.count() == 1

    history = report.history.first()

    assert history.report == report
    assert history.previous == initial_task
    assert history.next == other_task
    assert history.actor == reviewer
    assert history.comment == review_comment
