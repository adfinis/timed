/**
 * @module timed
 * @submodule timed-utils
 * @public
 */

/**
 * Pad items with 0 and join them with a colon
 */
function pad2joincolon(...items: unknown[]): string {
  return items.map((v) => String(v).padStart(2, "0")).join(":");
}

export { pad2joincolon };
