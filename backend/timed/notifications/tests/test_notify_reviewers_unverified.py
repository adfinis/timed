from datetime import date

import pytest
from django.core.management import call_command

from timed.notifications.models import Notification


@pytest.mark.django_db
@pytest.mark.freeze_time("2017-8-4")
@pytest.mark.parametrize(
    ("cc", "message"),
    [
        ("", ""),
        ("example@example.com", ""),
        ("example@example.com", "This is a test"),
        ("", "This is a test"),
    ],
)
def test_notify_reviewers_with_cc_and_message(
    mailoutbox,
    cc,
    message,
    project_assignee_factory,
    project_factory,
    report_factory,
    task_factory,
    user_factory,
):
    """Test time range 2017-7-1 till 2017-7-31."""
    # a reviewer which will be notified
    reviewer_work = user_factory()
    project_work = project_factory()
    project_assignee_factory(user=reviewer_work, project=project_work, is_reviewer=True)
    task_work = task_factory(project=project_work)
    report_factory(date=date(2017, 7, 1), task=task_work, verified_by=None)

    # a reviewer which doesn't have any unverified reports
    reviewer_no_work = user_factory()
    project_no_work = project_factory()
    project_assignee_factory(
        user=reviewer_no_work, project=project_no_work, is_reviewer=True
    )
    task_no_work = task_factory(project=project_no_work)
    report_factory(
        date=date(2017, 7, 1), task=task_no_work, verified_by=reviewer_no_work
    )

    call_command(
        "notify_reviewers_unverified",
        f"--cc={cc}",
        f"--message={message}",
    )

    # checks
    assert len(mailoutbox) == 1
    mail = mailoutbox[0]
    assert mail.to == [reviewer_work.email]
    url = f"http://localhost:4200/analysis?fromDate=2017-07-01&toDate=2017-07-31&reviewer={reviewer_work.id}&editable=1"
    assert url in mail.body
    assert message in mail.body
    assert mail.cc[0] == cc


@pytest.mark.django_db
@pytest.mark.freeze_time("2017-8-4")
def test_notify_reviewers(
    mailoutbox,
    project_assignee_factory,
    project_factory,
    report_factory,
    task_factory,
    user_factory,
):
    """Test time range 2017-7-1 till 2017-7-31."""
    # a reviewer which will be notified
    reviewer_work = user_factory()
    project_work = project_factory()
    project_assignee_factory(user=reviewer_work, project=project_work, is_reviewer=True)
    task_work = task_factory(project=project_work)
    report_factory(date=date(2017, 7, 1), task=task_work, verified_by=None)

    call_command("notify_reviewers_unverified")

    # checks
    assert len(mailoutbox) == 1
    mail = mailoutbox[0]
    assert mail.to == [reviewer_work.email]
    url = f"http://localhost:4200/analysis?fromDate=2017-07-01&toDate=2017-07-31&reviewer={reviewer_work.id}&editable=1"
    assert url in mail.body
    assert Notification.objects.count() == 1


@pytest.mark.django_db
@pytest.mark.freeze_time("2017-8-4")
def test_notify_reviewers_reviewer_hierarchy(
    mailoutbox,
    project_assignee_factory,
    project_factory,
    report_factory,
    task_assignee_factory,
    task_factory,
    user_factory,
):
    """Test notification with reviewer hierarchy.

    Test if only the lowest in reviewer hierarchy gets notified.
    """
    # user that shouldn't be notified
    project_reviewer = user_factory()
    # user that should be notified
    task_reviewer = user_factory()
    project = project_factory()
    task = task_factory(project=project)
    project_assignee_factory(user=project_reviewer, project=project, is_reviewer=True)
    task_assignee_factory(user=task_reviewer, task=task, is_reviewer=True)

    report_factory(date=date(2017, 7, 1), task=task, verified_by=None)

    call_command("notify_reviewers_unverified")

    assert len(mailoutbox) == 1
    mail = mailoutbox[0]
    assert mail.to == [task_reviewer.email]
    url = f"http://localhost:4200/analysis?fromDate=2017-07-01&toDate=2017-07-31&reviewer={task_reviewer.id}&editable=1"
    assert url in mail.body
