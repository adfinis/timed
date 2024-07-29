from __future__ import annotations

import pytest
from django.core.exceptions import ValidationError

from timed.employment.models import Location
from timed.models import WeekdaysList


@pytest.mark.django_db(transaction=True)
@pytest.mark.parametrize(
    ("value", "error"),
    [
        (list(range(1, 2)), False),
        (list(range(1, 3)), False),
        (list(range(1, 4)), False),
        (list(range(1, 5)), False),
        (list(range(1, 6)), False),
        (list(range(1, 7)), False),
        (list(range(1, 8)), False),
        (list(range(2, 9)), True),
        ("1,2", False),
        ("1,2,3,4,5", False),
        ("1,2,3,4,5,6", False),
        ("1,2,3,4,5,6,7,8", True),
        (list(range(5, 11)), True),
        (list(range(9, 11)), True),
        ("not,valid", True),
    ],
)
def test_weekdays_field(value: list[int], error: bool, location_factory):  # noqa: FBT001
    try:
        location_id = location_factory(workdays=value).id
        Location.objects.get(id=location_id)
        assert not error
    except ValidationError:
        assert error


@pytest.mark.parametrize(
    ("value", "expected"),
    [
        ([1, 2, 3], "1,2,3"),
        ([1, 2, 3, 4], "1,2,3,4"),
        ([1, 2, 3, 5], "1,2,3,5"),
    ],
)
def test_weekdayslist(value, expected):
    assert WeekdaysList.from_string(expected) == value
    assert str(WeekdaysList(value)) == expected
