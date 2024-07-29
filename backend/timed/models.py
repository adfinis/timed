"""Basic model and field classes to be used in all apps."""

from __future__ import annotations

from typing import TYPE_CHECKING

from django.core.exceptions import ValidationError
from django.db.models import CharField
from django.forms.fields import CharField as CharFormField
from django.utils.text import capfirst
from django.utils.translation import gettext_lazy as _

if TYPE_CHECKING:
    from typing import Self

MO, TU, WE, TH, FR, SA, SU = DAYS = range(1, 8)

WEEKDAYS = (
    (MO, _("Monday")),
    (TU, _("Tuesday")),
    (WE, _("Wednesday")),
    (TH, _("Thursday")),
    (FR, _("Friday")),
    (SA, _("Saturday")),
    (SU, _("Sunday")),
)


class WeekdaysList(list):
    """List used for weekdays."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.validate()

    def __str__(self):
        return ",".join(map(str, self))

    def validate(self) -> None:
        if invalid_days := [day for day in self if day not in DAYS]:
            raise ValidationError(
                [
                    ValidationError(
                        _("Invalid day: %(value)s"),
                        code="invalid",
                        params={"value": day},
                    )
                    for day in invalid_days
                ]
            )

    @classmethod
    def from_string(cls: type[Self], value: str) -> Self[int]:
        try:
            days = cls([int(day) for day in value.split(",")])
        except ValueError as exc:
            raise ValidationError(
                _("Invalid weekdays: %(value)s"),
                code="invalid",
                params={"value": value},
            ) from exc

        days.validate()
        return days


class WeekdaysFormField(CharFormField):  # pragma: no cover
    def to_python(self, value):
        if isinstance(value, str):
            return WeekdaysList.from_string(value)
        return value


class WeekdaysField(CharField):
    """Multi select field using weekdays as choices.

    Stores weekdays as comma-separated values in database as
    iso week day (MON = 1, SUN = 7).
    """

    def from_db_value(self, value, expression, connection):  # noqa: ARG002
        if value is None:  # pragma: no cover
            return value
        return WeekdaysList.from_string(value)

    def to_python(self, value):
        if isinstance(value, str):
            return WeekdaysList.from_string(value)
        if isinstance(value, list):
            return WeekdaysList(value)
        return value  # pragma: no cover

    def get_prep_value(self, value):
        if value is not None:
            return str(self.to_python(value))
        return value  # pragma: no cover

    def formfield(self, **kwargs):  # pragma: no cover
        defaults = {
            "required": not self.blank,
            "help_text": f"Comma Seperated List of days. MON = 1, SUN = 7\
            <br>e.g. '1,2,3,4,5' -> {', '.join(str(wd[1]) for wd in WEEKDAYS[:5])}",
            "label": capfirst(self.verbose_name),
        }

        if self.has_default():
            defaults["initial"] = self.get_default()

        return WeekdaysFormField(**defaults)

    def get_default(self):
        return self.to_python(self._get_default())
