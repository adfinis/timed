from datetime import date as Date, time as Time  # noqa: N812

import pytest
from django.db import connection
from django.db.migrations.executor import MigrationExecutor

APP_LABEL = "tracking"


@pytest.mark.parametrize(
    ("date", "from_time", "to_time"),
    [
        (Date(2022, 1, 1), Time(10, 30, 1), Time(11, 30, 6)),
        (Date(2022, 1, 2), Time(11, 30, 4), Time(11, 45, 10)),
        (Date(2023, 2, 2), Time(4, 30, 34), Time(6, 45, 6)),
        (
            Date(2023, 2, 3),
            Time(10, 30, 11),
            Time(10, 30, 11),
        ),  # edge case (stuff will be `None` because of bounds)
    ],
)
@pytest.mark.django_db(transaction=True)
def test_activity_datetime_ranges_migration(user, task, date, from_time, to_time):
    """Test migrating activities to datetime ranges."""
    executor = MigrationExecutor(connection)
    migrate_to = [(APP_LABEL, "0021_migrate_activities_to_datetime_ranges")]
    migrate_from = [(APP_LABEL, "0020_report_search_vector_trigger")]

    executor.loader.build_graph()
    executor.migrate(migrate_from)
    old_apps = executor.loader.project_state(migrate_from).apps
    OldActivity = old_apps.get_model(APP_LABEL, "Activity")

    activity = OldActivity.objects.create(
        user_id=user.pk,
        task_id=task.pk,
        date=date,
        from_time=from_time,
        to_time=to_time,
    )

    executor.loader.build_graph()
    executor.migrate(migrate_to)
    new_apps = executor.loader.project_state(migrate_to).apps
    Activity = new_apps.get_model(APP_LABEL, "Activity")

    migrated_activity = Activity.objects.first()

    # sanity check
    assert migrated_activity.pk == activity.pk

    # TODO: fix naming
    lower = migrated_activity.range.lower
    upper = migrated_activity.range.upper

    assert lower.date() == activity.date
    assert upper.date() == activity.date

    # TODO: figure out timezone mess
    assert lower.time() == activity.from_time
    assert upper.time() == activity.to_time
