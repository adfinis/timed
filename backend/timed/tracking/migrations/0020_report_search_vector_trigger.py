from django.contrib.postgres.search import SearchVector
from django.db import migrations


def compute_search_vector(apps, schema_editor):
    Report = apps.get_model("tracking", "Report")
    Report.objects.update(search_vector=SearchVector("comment"))


class Migration(migrations.Migration):
    dependencies = [
        (
            "tracking",
            "0019_remove_report_search_vector_idx_report_search_vector_and_more",
        ),
    ]

    operations = [
        migrations.RunPython(
            compute_search_vector, reverse_code=migrations.RunPython.noop
        ),
    ]
