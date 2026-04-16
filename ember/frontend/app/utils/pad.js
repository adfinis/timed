/**
 * @module timed
 * @submodule timed-utils
 * @public
 */

/**
 * Pad items with 0 and join them with a colon
 *
 * @function pad2joincolon
 * @param {any[]} items - The items to pad and join
 * @return {String} The joined string
 * @public
 */
function pad2joincolon(...items) {
  return items.map((v) => String(v).padStart(2, "0")).join(":");
}

export { pad2joincolon };
