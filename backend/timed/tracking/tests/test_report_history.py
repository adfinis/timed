from __future__ import annotations

from typing import TYPE_CHECKING

from django.urls import reverse
from rest_framework import status

if TYPE_CHECKING:
    from django.test.client import Client

    from timed.tracking.models import ReportHistory


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
