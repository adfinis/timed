/**
 * @description Modified version of https://github.com/knoxville-utilities-board/nrg-ui/blob/579fc700d173d7a2bc717fb7c7a7a9305d38d245/packages/ember-core/src/test-support/index.ts
 */

import { getContext, settled } from "@ember/test-helpers";

/**
 * @async
 * @param {string | string[]} breakpoint The name of the breakpoint to set (e.g., 'md'),
 *   or an array of names for matching multiple breakpoints. Provide the string 'auto'
 *   to disable mocking and revert to using the real browser environment's `matchMedia`.
 * @returns {Promise<void>} A promise that resolves after the breakpoint has been set
 *   and all resulting async behavior has settled.
 * @throws {Error} If a provided breakpoint name (other than 'auto') is not
 *   defined in the media service's `breakpoints` object.
 */
export async function setBreakpoint(breakpoint) {
  const breakpointArray = Array.isArray(breakpoint) ? breakpoint : [breakpoint];
  const { owner } = /** @type {{ owner: import('@ember/owner').default }} */ (
    getContext()
  );

  /** @type {import('../../app/services/media').default} */
  const media = owner.lookup("service:media");

  for (let i = 0; i < breakpointArray.length; i++) {
    const breakpointName = breakpointArray[i];

    if (breakpointName === "auto") {
      media.mocked = false;
      return;
    }

    if (Object.keys(media.breakpoints).indexOf(breakpointName) === -1) {
      throw new Error(
        `[setBreakpoint] Breakpoint "${breakpointName}" is not defined in the media service's breakpoints.`,
      );
    }
  }

  media.matches = breakpointArray;
  media.trigger("mediaChanged");

  await settled();
}
