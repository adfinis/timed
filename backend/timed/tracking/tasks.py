from __future__ import annotations

from typing import TYPE_CHECKING

from django.conf import settings
from django.core.mail import EmailMessage, get_connection
from django.template.loader import get_template

if TYPE_CHECKING:
    from django.db.models.query import QuerySet

    from timed.employment.models import User
    from timed.tracking.models import Report


def _send_notification_emails(
    changes: list[dict], reviewer: User, reason: str = "", *, rejected: bool = False
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
                "reason": reason,
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


def _get_report_changeset(report: Report, fields: dict) -> bool | dict:
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
        return False
    return changeset


def notify_user_changed_report(
    report: Report, fields: dict, reviewer: User, reason: str = ""
) -> None:
    changeset = _get_report_changeset(report, fields)

    if not changeset:
        return

    user_changes = {"user": report.user, "changes": [changeset]}
    _send_notification_emails([user_changes], reviewer, reason)


def notify_user_changed_reports(
    queryset: QuerySet[Report], fields: dict, reviewer: User, reason: str = ""
) -> None:
    users = [report.user for report in queryset.order_by("user").distinct("user")]
    user_changes = []

    for user in users:
        changes = []
        for report in queryset.filter(user=user).order_by("date"):
            changeset = _get_report_changeset(report, fields)

            # skip edits of own reports and empty changes
            if report.user == reviewer or not changeset:
                continue
            changes.append(changeset)

        # skip user if changes are empty
        if not changes:
            continue

        user_changes.append({"user": user, "changes": changes})

    _send_notification_emails(user_changes, reviewer, reason)


def notify_user_rejected_report(
    report: Report, reviewer: User, reason: str = ""
) -> None:
    user_changes = {"user": report.user, "changes": [{"report": report}]}
    _send_notification_emails([user_changes], reviewer, reason, rejected=True)


def notify_user_rejected_reports(
    queryset: QuerySet[Report], _fields: dict, reviewer: User, reason: str = ""
) -> None:
    users = [report.user for report in queryset.order_by("user").distinct("user")]
    user_changes = []

    for user in users:
        changes = []
        for report in queryset.filter(user=user).order_by("date"):
            changeset = {"report": report}
            changes.append(changeset)
        user_changes.append({"user": user, "changes": changes})

    _send_notification_emails(user_changes, reviewer, reason, rejected=True)
