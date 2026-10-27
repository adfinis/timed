import { Duration } from "luxon";
import { durationFromString } from "./duration.ts";

const DAY_DURATION_PATTERN =
  /^(?<hours>[01]?\d|2[0-3])?(?<colon>:?)(?<minutes>[0-5][0-9])?$/;

const _dayDurationFromString = durationFromString(DAY_DURATION_PATTERN);
const DAY_DURATION_MIN = Duration.fromObject({ minutes: 0 });
const DAY_DURATION_MAX = Duration.fromObject({ hours: 23, minutes: 59 });

const parseStringDuration = (duration: string) => {
  const parse = () => {
    // case 1, duration is an empty string
    if (!duration) return DAY_DURATION_MIN;

    const day = _dayDurationFromString(duration);

    // case 2, duration is not a valid 24h duration
    if (!day) return DAY_DURATION_MIN;

    return Duration.fromObject({
      hours: parseInt(day.hours ?? "0"),
      minutes: parseInt(day.minutes ?? "0"),
    });
  };
  // there is no way for any input to be >= 24 hours
  // and also no way for it to be smaller than 00:00
  // which means we don't need to clamp here
  return parse().shiftTo("hours", "minutes", "seconds");
};

export {
  DAY_DURATION_PATTERN,
  DAY_DURATION_MIN,
  DAY_DURATION_MAX,
  parseStringDuration,
};
