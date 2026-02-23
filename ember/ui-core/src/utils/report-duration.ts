import { Duration } from "luxon";
import {
  clampDuration,
  roundDuration,
  durationFromString,
  DAY_DURATION_PATTERN,
} from "./duration.ts";

const REPORT_DURATION_MIN = Duration.fromObject({ minutes: 15 });
const REPORT_DURATION_MAX = Duration.fromObject({ hours: 23, minutes: 45 });

const REPORT_DURATION_PATTERN: RegExp =
  /^(?<hours>[01]?\d|2[0-3])?(?<colon>:?)(?<minutes>00|15|30|45)?$/;

const _reportDurationFromString = durationFromString(REPORT_DURATION_PATTERN);
const _dayDurationFromString = durationFromString(DAY_DURATION_PATTERN);
const roundToReport = roundDuration(REPORT_DURATION_MIN);
const clampReport = clampDuration(REPORT_DURATION_MIN, REPORT_DURATION_MAX);

const parseStringDuration = (duration: string) => {
  const parse = () => {
    // case 1, duration is an empty string
    if (!duration) return REPORT_DURATION_MIN;

    const report = _reportDurationFromString(duration);
    const day = _dayDurationFromString(duration);

    const mins = parseInt(duration);
    // case 2, duration is not a valid 24h duration (and therefore also not a valid report duration)
    // for e.g. 60 or 90 (valid integers, that are multiples of 15) we interpret the input as minutes
    // e.g. 60 -> 01:00, 90 -> 01:30
    // otherwise we return the default
    if (!day) {
      return !duration.includes(":") && mins % 15 === 0
        ? Duration.fromObject({ minutes: mins })
        : REPORT_DURATION_MIN;
    }

    // case 3, duration is not a valid report, but a valid 24h duration
    // if there was a colon, we take the 24h duration and round it
    // if there was no colon, we check if the duration as integer is divisble by 15
    // if it is, we interpret the input as minutes
    // e.g. 120 -> 02:00 (instead of 01:15)
    if (!report && day) {
      if (!day.colon && mins % 15 == 0)
        return Duration.fromObject({ minutes: mins });
      return roundToReport(
        Duration.fromObject({
          hours: parseInt(day.hours ?? "0"),
          minutes: parseInt(day.minutes!),
        }),
      );
    }

    // case 4, duration is a valid report
    // if there was a colon, we return it as is
    // if there was no colon, and the hours == 15 we return 00:15, because 15 hour reports usually don't exist
    if (!report!.colon && report!.hours === "15" && !report!.minutes) {
      return REPORT_DURATION_MIN;
    }
    return Duration.fromObject({
      hours: parseInt(report!.hours ?? "0"),
      minutes: parseInt(report!.minutes ?? "0"),
    });
  };
  return clampReport(parse().rescale());
};

export { REPORT_DURATION_MIN, REPORT_DURATION_MAX, parseStringDuration };
