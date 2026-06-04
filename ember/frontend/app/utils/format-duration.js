/**
 * @module timed
 * @submodule timed-utils
 * @public
 */
import { Duration } from "luxon";

import { pad2joincolon } from "timed/utils/pad";

const { floor, abs } = Math;

/**
 * Converts a duration into a string with zeropadded digits
 *
 * @param {import('luxon').Duration} duration The duration to format
 * @param {boolean} seconds Whether to show seconds
 * @return {string} The formatted duration
 * @public
 */
export default function formatDuration(duration, seconds = true) {
  if (typeof duration === "number") {
    duration = Duration.fromMillis(duration);
  }

  if (!Duration.isDuration(duration)) {
    return seconds ? "--:--:--" : "--:--";
  }

  duration = duration.shiftTo("hours", "minutes", "seconds", "milliseconds");

  const prefix = duration < 0 ? "-" : "";

  const hours = floor(abs(duration.as("hours")));
  const minutes = abs(duration.minutes);

  if (seconds) {
    const _seconds = abs(duration.seconds);

    return prefix + pad2joincolon(hours, minutes, _seconds);
  }

  return prefix + pad2joincolon(hours, minutes);
}
