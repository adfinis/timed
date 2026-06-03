/**
 * @module timed
 * @submodule timed-utils
 * @public
 */
import { Duration } from "luxon";

/**
 * Parse a django duration string
 *
 * @function parseDjangoDuration
 * @param {string} str The django duration string
 * @return {import('luxon').Duration} The parsed duration
 * @public
 */
export default function parseDjangoDuration(str) {
  if (!str) {
    return null;
  }

  const re = new RegExp(/^(-?\d+)?\s?(\d{2}):(\d{2}):(\d{2})(\.\d{6})?$/);

  const [, days, hours, minutes, seconds, microseconds] = str
    .match(re)
    .map((m) => Number(m) || 0);

  return Duration.fromObject({
    days,
    hours,
    minutes,
    seconds,
    milliseconds: microseconds * 1000,
  });
}
