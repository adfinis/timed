# Generated by Django 4.2.11 on 2024-07-01 09:36

import django.contrib.postgres.indexes
import django.contrib.postgres.search
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tracking', '0017_alter_report_remaining_effort'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='report',
            index=django.contrib.postgres.indexes.GinIndex(django.contrib.postgres.search.SearchVector('comment', config='english'), name='search_vector_idx'),
        ),
    ]
