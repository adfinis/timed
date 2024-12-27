from django.db import models

from timed.employment.models import User
from timed.projects.models import Customer, Project, Task


class ReportStatistic(models.Model):
    # Implement a basic STAR SCHEMA view: Basic aggregate is done in the VIEW,
    # everything else of interest can be JOINed directly

    task = models.OneToOneField(
        Task, on_delete=models.DO_NOTHING, null=True, related_name="+"
    )
    user = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, null=True, related_name="+"
    )
    project = models.ForeignKey(
        Project, on_delete=models.DO_NOTHING, null=False, related_name="+"
    )
    customer = models.ForeignKey(
        Customer, on_delete=models.DO_NOTHING, null=False, related_name="+"
    )
    duration = models.DurationField()

    month = models.IntegerField()
    full_month = models.CharField(max_length=7)
    year = models.IntegerField()
    date = models.DateField()

    class Meta:
        managed = False

    def __str__(self):
        return f"ReportStat({self.task} @ {self.date}, {self.user})"
