/**
 * @module timed
 * @submodule timed-utils
 * @public
 */
import moment, { type Duration } from "moment";
import { pad2joincolon } from "timed/utils/pad";

const { floor, abs } = Math;

/**
 * Converts a moment duration into a string with zeropadded digits
 */
export default function formatDuration(
  duration: Duration | number,
  seconds: boolean = true
): string {
  if (typeof duration === "number") {
    duration = moment.duration(duration);
  }

  if (!moment.isDuration(duration)) {
    return seconds ? "--:--:--" : "--:--";
  }

  const prefix = +duration < 0 ? "-" : "";

  const hours = floor(abs(duration.asHours()));
  const minutes = abs(duration.minutes());

  if (seconds) {
    const _seconds = abs(duration.seconds());

    return prefix + pad2joincolon(hours, minutes, _seconds);
  }

  return prefix + pad2joincolon(hours, minutes);
}
