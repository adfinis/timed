from datetime import time, timedelta


def round_time(t: time) -> time:
    """Round a datetime.time to the nearest 15min."""
    minutes = round((t.minute * 60 + t.second) / (60 * 15)) * 15
    hours = t.hour

    if minutes > time.max.minute:
        hours += 1
        minutes = 0

    if hours > time.max.hour:
        hours = 0

    return time(
        hours,
        minutes,
        0,
    )


def round_timedelta(td: timedelta) -> timedelta:
    """Round a datetime.timedelta to the nearest 15min."""
    return timedelta(seconds=max(15 * 60, round(td.seconds / (15 * 60)) * 15 * 60))
