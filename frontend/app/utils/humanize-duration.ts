/**
 * @module timed
 * @submodule timed-utils
 * @public
 */

import type { Duration } from "moment";

const { abs, floor } = Math;

/**
 * Converts a moment duration into a string with hours minutes and optionally
 * seconds
 */
export default function humanizeDuration(
  duration: Duration,
  seconds: boolean = false
): string {
  if (!duration || duration.milliseconds() < 0) {
    return seconds ? "0h 0m 0s" : "0h 0m";
  }

  const prefix = +duration < 0 ? "-" : "";

  // TODO: The locale should be defined by the browser
  const h = floor(abs(duration.asHours())).toLocaleString("de-CH");
  const m = abs(duration.minutes());

  if (seconds) {
    const s = abs(duration.seconds());

    return `${prefix}${h}h ${m}m ${s}s`;
  }

  return `${prefix}${h}h ${m}m`;
}
