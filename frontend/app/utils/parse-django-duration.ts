/**
 * @module timed
 * @submodule timed-utils
 * @public
 */
import moment, { type Duration } from "moment";

interface Groups {
  days?: number;
  hours: number;
  minutes: number;
  seconds: number;
  microseconds?: number;
}

/**
 * Converts a django duration string to a moment duration
 */
export default function parseDjangoDuration(str: string): Duration | null {
  if (!str) {
    return null;
  }

  const re =
    /^(?<days>-?\d+)?\s?(?<hours>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2})(?<microseconds>\.\d{6})?$/;

  const matches = str.match(re) as {
    groups: Groups;
  } | null;

  if (!matches) {
    return null;
  }

  const {
    days: _days,
    hours,
    minutes,
    seconds,
    microseconds: _microseconds,
  } = matches.groups;

  const [days, microseconds] = [_days, _microseconds].map(
    (v) => Number(v) || 0
  ) as [number, number];

  return moment.duration({
    days,
    hours,
    minutes,
    seconds,
    milliseconds: microseconds * 1000,
  });
}
