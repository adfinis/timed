import { Duration } from "luxon";

const roundDuration = (base: Duration) => (duration: Duration) => {
  const baseMs = base.as("milliseconds");

  return Duration.fromMillis(
    Math.round(duration.as("milliseconds") / baseMs) * baseMs,
  ).rescale();
};

const clampDuration =
  (min: Duration, max: Duration) => (duration: Duration) => {
    const ms = duration.as("milliseconds");

    if (ms < min.as("milliseconds")) {
      return min;
    }
    return ms > max.as("milliseconds") ? max : duration;
  };

const durationFromString =
  <
    T extends {
      colon?: string;
      hours?: string;
      minutes?: string;
    },
  >(
    pattern: RegExp,
  ) =>
  (duration: string) => {
    const matches = pattern.exec(duration);
    if (!matches) return null;
    return matches.groups as T;
  };

const normalizeStringDayDuration = (duration: string) => {
  return /(\d?\d?:?\d?\d?)/g.exec(duration)?.at(0) ?? "";
};

const normalizeStringDuration = (duration: string) => {
  return /(-?\d*:?\d?\d?)/g.exec(duration)?.at(0) ?? "";
};

const _durationAsString = (duration: Duration, seconds = false) => {
  if (!Duration.isDuration(duration)) return seconds ? "--:--:--" : "--:--";
  const fmt = seconds ? "hh:mm:ss" : "hh:mm";
  return duration.toFormat(fmt, { signMode: "negativeLargestOnly" });
};

const durationAsString = (duration: Duration) =>
  _durationAsString(duration, false);

const durationAsStringWithSeconds = (duration: Duration) =>
  _durationAsString(duration, true);

const DAY_DURATION_PATTERN =
  /^(?<hours>[01]?\d|2[0-3])?(?<colon>:?)(?<minutes>[0-5][0-9])?$/;

const DURATION_PATTERN =
  /^(?<sign>[-]?)(?<hours>\d+?)?(?<colon>:?)(?<minutes>[0-5][0-9])?$/;

const _durationFromString = durationFromString<{
  sign: string;
  hours?: string;
  minutes?: string;
}>(DURATION_PATTERN);

const parseDurationFromString = (duration: string) => {
  const match = _durationFromString(duration);
  if (!match || (!match.hours && !match.minutes)) return Duration.fromMillis(0);

  const { sign, hours, minutes } = match;

  const result = Duration.fromObject(
    {
      hours: parseInt(hours ?? "0"),
      minutes: parseInt(minutes ?? "0"),
    },
    { conversionAccuracy: "longterm" },
  );
  return (sign === "-" ? result.negate() : result).rescale();
};

export {
  roundDuration,
  clampDuration,
  durationFromString,
  durationAsString,
  durationAsStringWithSeconds,
  parseDurationFromString,
  normalizeStringDuration,
  normalizeStringDayDuration,
  DAY_DURATION_PATTERN,
};
