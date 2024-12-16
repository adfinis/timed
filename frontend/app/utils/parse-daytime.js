/**
 * @module timed
 * @submodule timed-utils
 * @public
 */

const DAY_TIME_REGEX = /^(?<hours>[01]?\d|2[0-3])?:?(?<minutes>00|15|30|45)?$/;

/**
 * Converts a django duration string to a moment duration
 *
 * @function parseDayTime
 * @param {string} str The duration string to parse
 * @return {[number, number] | null} The parsed duration
 * @public
 */
export default function parseDayTime(str) {
  if (!str) {
    return null;
  }

  const matches = DAY_TIME_REGEX.exec(str);
  if (!matches) return null;
  const { hours, minutes } = matches.groups;

  return [parseInt(hours ?? "0"), parseInt(minutes ?? "0")];
}
