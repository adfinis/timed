# Generated by Django 4.2.11 on 2024-06-18 10:47

from django.db import migrations
import timed.models


class Migration(migrations.Migration):

    dependencies = [
        ('employment', '0015_user_is_accountant'),
    ]

    operations = [
        migrations.AlterField(
            model_name='location',
            name='workdays',
            field=timed.models.WeekdaysField(default=[1, 2, 3, 4, 5]),
        ),
    ]
