"""In historic versions of timed, we used `NumberFilter`s or `BaseInFilter`s for filtering by one or more `id`s.

`NumberFilter` defaults to `django.forms.DecimalField`s, therefore our `id`s were actually `Decimal`s, which allowed for bogus negative and/or non-whole numbers

`BaseInFilter` is supposed to be combined with another filter, which it wasn't, not even with a `NumberFilter`, in newer versions we only accept positive integers in both.
"""

from django.forms import IntegerField
from django_filters.rest_framework import BaseInFilter, NumberFilter


class PositiveIntegerField(IntegerField):
    """`PositiveIntegerField` for use with `NumberFilter`s.

    `NumberFilter` defaults to `forms.DecimalField`, which isn't what we want in most cases.
    """

    def __init__(self, *args, **kwargs):
        kwargs.setdefault("min_value", 1)
        super().__init__(*args, **kwargs)


class IdFilter(NumberFilter):
    """A filter to use for primary keys (ids)."""

    field_class = PositiveIntegerField


class IdInFilter(BaseInFilter, IdFilter):
    """In filter to use with primary keys (ids)."""
