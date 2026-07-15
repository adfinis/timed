from __future__ import annotations

from itertools import groupby
from operator import attrgetter
from typing import TYPE_CHECKING

from django.conf import settings
from django.core.mail import EmailMessage, get_connection
from django.template.loader import get_template

if TYPE_CHECKING:
    from django.db.models.query import QuerySet

    from timed.employment.models import User
    from timed.tracking.models import Report


def _send_notification_emails(
    changes: list[dict],
    reviewer: User,
    comment: str = "",
    *,
    rejected: bool = False,
) -> None:
    """Send email for each user."""
    if rejected:
        subject = "[Timed] Your reports have been rejected"
        template = get_template("mail/notify_user_rejected_reports.tmpl", using="text")
    else:
        template = get_template("mail/notify_user_changed_reports.tmpl", using="text")
        subject = "[Timed] Your reports have been changed"
    from_email = settings.DEFAULT_FROM_EMAIL
    connection = get_connection()

    messages = []

    for user_changes in changes:
        user = user_changes["user"]

        body = template.render(
            {
                # we need start and end date in system format
                "reviewer": reviewer,
                "user_changes": user_changes["changes"],
                "comment": comment,
            }
        )

        message = EmailMessage(
            subject=subject,
            body=body,
            from_email=from_email,
            to=[user.email],
            connection=connection,
            reply_to=[reviewer.email],
            headers=settings.EMAIL_EXTRA_HEADERS,
        )

        messages.append(message)
    if len(messages) > 0:
        connection.send_messages(messages)


def _get_report_changeset(report: Report, fields: dict) -> dict | None:
    changeset = {
        "report": report,
        "changes": {
            key: {"old": getattr(report, key), "new": fields[key]}
            for key in fields
            # skip if field is not changed or just a reviewer field
            if getattr(report, key) != fields[key]
            and key in settings.TRACKING_REPORT_VERIFIED_CHANGES
        },
    }
    if not changeset["changes"]:
        return None
    return changeset


def notify_user_changed_report(
    report: Report,
    reviewer: User,
    fields: dict | None = None,
    comment: str = "",
    *,
    rejected: bool = False,
) -> None:
    if fields is None:
        fields = {}
    if rejected:
        user_changes = {"user": report.user, "changes": [{"report": report}]}
    else:
        if not (changeset := _get_report_changeset(report, fields)):
            return

        user_changes = {"user": report.user, "changes": [changeset]}
    _send_notification_emails([user_changes], reviewer, comment, rejected=rejected)


def notify_user_changed_reports(
    queryset: QuerySet[Report],
    fields: dict,
    reviewer: User,
    comment: str = "",
    *,
    rejected: bool = False,
) -> None:
    user_changes = []
    if not rejected:
        queryset = queryset.exclude(user=reviewer)

    reports = queryset.select_related("user").order_by("user_id", "date")

    for user, user_reports in groupby(reports, key=attrgetter("user")):
        changes = []

        for report in user_reports:
            if rejected:
                changes.append({"report": report})
                continue
            if changeset := _get_report_changeset(report, fields):
                changes.append(changeset)

        if changes:
            user_changes.append({"user": user, "changes": changes})

    if user_changes:
        _send_notification_emails(user_changes, reviewer, comment, rejected=rejected)
