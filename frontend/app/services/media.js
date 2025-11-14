/**
 * @description Modified version of https://github.com/knoxville-utilities-board/nrg-ui/blob/579fc700d173d7a2bc717fb7c7a7a9305d38d245/packages/ember-core/src/services/media.ts
 */

import { assert } from "@ember/debug";
import Service from "@ember/service";
import {
  getOwnConfig,
  isTesting as isTestingMacro,
  macroCondition,
} from "@embroider/macros";
import { tracked } from "@glimmer/tracking";
import { runTask } from "ember-lifeline";
import { TrackedSet } from "tracked-built-ins";

/**
 * A callback function executed on media-related events.
 * @callback Fn
 * @returns {unknown | Promise<unknown>}
 */

/**
 * An object containing sets of callbacks for media events.
 * @typedef {object} Callbacks
 * @property {Set<Fn>} mediaChanged - Callbacks fired when the media query matches change.
 */

const isTesting = macroCondition(isTestingMacro()) ? true : false;

/**
 * The default breakpoints for the media service.
 * The values are based on Tailwinds's breakpoints.
 *
 * @type {Readonly<Object<string, string>>}
 * @const
 */
export const defaultBreakpoints = Object.freeze({
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  xl2: "(min-width: 1536px)",
});

export default class Media extends Service {
  /**
   * @private
   * @type {string}
   */
  _mockedBreakpoint = "xl";

  /**
   * @private
   * @type {TrackedSet<string>}
   */
  @tracked
  _matches = new TrackedSet();

  /**
   * @type {boolean}
   */
  @tracked
  mocked = isTesting;

  /**
   * @type {Callbacks}
   */
  callbacks = {
    mediaChanged: new Set(),
  };

  /**
   * @type {Object<string, string>}
   */
  breakpoints = {
    ...defaultBreakpoints,
    ...getOwnConfig()?.breakpoints,
  };

  /**
   * @param {import('@ember/owner').default} owner The application owner.
   */
  constructor(owner) {
    super(owner);

    for (const [name, query] of Object.entries(this.breakpoints)) {
      this.match(name, query);
    }
  }

  /**
   * @type {Set<string>}
   * @readonly
   */
  get matches() {
    if (this._matches.size) {
      return this._matches;
    }

    return new TrackedSet(isTesting ? [this._mockedBreakpoint] : []);
  }

  /**
   * @param {Iterable<string>} value An iterable of breakpoint names to set as matches.
   */
  set matches(value) {
    this._matches = new TrackedSet(value);
  }

  /**
   * @type {boolean}
   * @readonly
   */
  get isSm() {
    return this.matches.has("sm");
  }

  /**
   * @type {boolean}
   * @readonly
   */
  get isMd() {
    return this.matches.has("md");
  }

  /**
   * @type {boolean}
   * @readonly
   */
  get isLg() {
    return this.matches.has("lg");
  }

  /**
   * @type {boolean}
   * @readonly
   */
  get isXl() {
    return this.matches.has("xl");
  }

  /**
   * @type {boolean}
   * @readonly
   */
  get isXl2() {
    return this.matches.has("xl2");
  }

  /**
   * @private
   * @param {'mediaChanged'} name The name of the event ('mediaChanged').
   * @returns {Set<Fn>} The set of callbacks for the event.
   * @throws {Error} If the callback name is invalid.
   */
  #getCallbackList(name) {
    const callbackList = this.callbacks[name];
    assert(`Callback '${name}' is not valid`, callbackList !== undefined);
    return callbackList;
  }

  /**
   * @param {'mediaChanged'} name The name of the event to listen for.
   * @param {Fn} callback The function to execute when the event is triggered.
   * @returns {void}
   */
  on(name, callback) {
    const callbackList = this.#getCallbackList(name);
    callbackList.add(callback);
  }

  /**
   * @param {'mediaChanged'} name The name of the event.
   * @param {Fn} callback The callback function to remove.
   * @returns {void}
   */
  off(name, callback) {
    const callbackList = this.#getCallbackList(name);
    callbackList.delete(callback);
  }

  /**
   * @param {'mediaChanged'} name The name of the event to trigger.
   * @returns {void}
   */
  trigger(name) {
    const callbackList = this.#getCallbackList(name);
    for (const callback of callbackList) {
      try {
        callback();
      } catch {
        // silently ignore errors in callbacks.
      }
    }
  }

  /**
   * @param {string} name The name to associate with the media query (e.g., 'sm').
   * @param {string} query The CSS media query string (e.g., '(min-width: 640px)').
   * @returns {void}
   */
  match(name, query) {
    if (isTesting) {
      return;
    }

    const mediaQueryList = matchMedia(query);

    /**
     * @param {MediaQueryList | MediaQueryListEvent} matcher The media query list or event object.
     */
    const listener = (matcher) => {
      let changed = false;

      if (matcher.matches) {
        if (!this._matches.has(name)) {
          this._matches.add(name);
          changed = true;
        }
      } else {
        changed = this._matches.has(name);
        this._matches.delete(name);
      }

      if (changed) {
        runTask(this, () => this.trigger("mediaChanged"));
      }
    };

    mediaQueryList.addEventListener("change", (event) => {
      runTask(this, () => listener(event));
    });

    listener(mediaQueryList);
  }
}
