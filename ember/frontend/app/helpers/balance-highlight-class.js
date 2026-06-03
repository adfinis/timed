/**
 * @module timed
 * @submodule timed-helpers
 * @public
 */
import { helper } from "@ember/component/helper";
import { Duration } from "luxon";

/**
 * Helper to determine the color of a balance
 *
 * > 0: red-ish
 * < 0: green-ish
 *
 * @function balanceHighlightClass
 * @param {Array} options The options delivered to the helper
 * @return {String} The CSS class to apply the color
 * @public
 */
export function balanceHighlightClass([balance]) {
  const minutes = Duration.isDuration(balance) ? balance.as("minutes") : 0;

  if (minutes > 0) {
    return "text-success";
  } else if (minutes < 0) {
    return "text-danger";
  }

  return "";
}

export default helper(balanceHighlightClass);
