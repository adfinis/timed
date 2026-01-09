import { Duration } from "luxon";
import {
  clampDuration,
  durationFromString,
  DAY_DURATION_PATTERN,
} from "./duration.ts";

const ACTIVITY_DURATION_MIN = Duration.fromObject({ minutes: 1 });
const ACTIVITY_DURATION_MAX = Duration.fromObject({ hours: 23, minutes: 49 });

const _dayDurationFromString = durationFromString(DAY_DURATION_PATTERN);
const clampReport = clampDuration(ACTIVITY_DURATION_MIN, ACTIVITY_DURATION_MAX);

const parseStringDuration = (duration: string) => {
  const parse = () => {
    // case 1, duration is an empty string
    if (!duration) return ACTIVITY_DURATION_MIN;

    const day = _dayDurationFromString(duration);

    const mins = parseInt(duration);
    // case 2, duration is not a valid 24h duration
    // for e.g. 60 or 90 (valid integers, that are multiples of 15) we interpret the input as minutes
    // e.g. 60 -> 01:00, 90 -> 01:30
    // otherwise we return the default
    if (!day) {
      return !duration.includes(":") && mins % 15 === 0
        ? Duration.fromObject({ minutes: mins })
        : ACTIVITY_DURATION_MIN;
    }

    // case 3, duration is a valid 24h duration
    // if there was a colon, we take the 24h duration
    // if there was no colon, !minutes, and hours >= 10 we interpret the input as minutes
    // e.g. 10 -> 00:10 (instead of 10:00)
    if (!day.colon && day.hours && !day.minutes && parseInt(day.hours) >= 10)
      return Duration.fromObject({ minutes: mins });

    return Duration.fromObject({
      hours: parseInt(day.hours ?? "0"),
      minutes: parseInt(day.minutes ?? "0"),
    });
  };
  return clampReport(parse().rescale());
};

export { ACTIVITY_DURATION_MIN, ACTIVITY_DURATION_MAX, parseStringDuration };
