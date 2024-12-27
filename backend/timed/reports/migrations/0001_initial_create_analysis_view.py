from django.db import migrations, models

CREATE_VIEW_SQL = """
   CREATE VIEW "reports_reportstatistic" AS (
        SELECT
            projects_task.id as id, -- avoid jumping through hoops for Django
            projects_task.id as task_id,
            user_id,

            projects_project.id as project_id,
            projects_project.customer_id as customer_id,

            sum(coalesce(duration, '00:00:00')) as duration,

            date,
            extract('year' from date)   as year,
            extract('month' from date)     as month,
            (extract('year' from date) * 100 + extract('month' from date))
                as full_month

        FROM projects_task
        LEFT JOIN tracking_report ON projects_task.id = tracking_report.task_id
        JOIN projects_project ON projects_project.id = projects_task.project_id

        GROUP BY
            projects_task.id,
            user_id,
            date,
            projects_task.id,
            projects_project.id,
            projects_project.customer_id
    )
"""

DROP_VIEW_SQL = """
   DROP VIEW "reports_reportstatistic"
"""


class Migration(migrations.Migration):

    dependencies = [
        ('tracking', '0001_initial')
    ]

    operations = [
        migrations.RunSQL(CREATE_VIEW_SQL, DROP_VIEW_SQL),
        migrations.CreateModel(
            name='reportstatistic',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('duration', models.DurationField()),
                ('month', models.IntegerField()),
                ('full_month', models.CharField(max_length=7)),
                ('year', models.CharField(max_length=4)),
            ],
            options={
                'managed': False,
            },
        ),
    ]
