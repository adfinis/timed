from datetime import time, timedelta

import pytest

from timed.utils import round_time, round_timedelta


@pytest.mark.parametrize(
    ("unrounded", "rounded"),
    [
        (
            time(5, 14, 11),
            time(5, 15, 0),
        ),
        (
            time(12, 15, 0),
            time(12, 15, 0),
        ),
        (
            time(14, 37, 20),
            time(14, 30, 0),
        ),
        (
            time(22, 37, 35),
            time(22, 45, 0),
        ),
        (
            time(23, 56, 35),
            time(0, 0, 0),
        ),
    ],
)
def test_round_time(unrounded: time, rounded: time) -> None:
    assert round_time(unrounded) == rounded


@pytest.mark.parametrize(
    ("unrounded", "rounded"),
    [
        (
            timedelta(hours=5, minutes=17),
            timedelta(hours=5, minutes=15),
        ),
        (
            timedelta(hours=2, minutes=37, seconds=25),
            timedelta(hours=2, minutes=30),
        ),
        (
            timedelta(hours=3, minutes=37, seconds=48),
            timedelta(hours=3, minutes=45),
        ),
    ],
)
def test_round_timedelta(unrounded: timedelta, rounded: timedelta) -> None:
    assert round_timedelta(unrounded) == rounded
