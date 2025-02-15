import { getOwner } from "@ember/application";
import { A } from "@ember/array";
import { computed } from "@ember/object";
import { classify } from "@ember/string";
import { registerAsyncHelper } from "@ember/test";
import MediaService from "ember-responsive/services/media";

MediaService.reopen({
  // Change this if you want a different default breakpoint in tests.
  _defaultBreakpoint: "xl",

  _breakpointArr: computed("breakpoints", function () {
    return Object.keys(this.breakpoints) || A([]);
  }),

  _forceSetBreakpoint(breakpoint) {
    let found = false;

    const props = {};
    this._breakpointArr.forEach(function (bp) {
      const val = bp === breakpoint;
      if (val) {
        found = true;
      }

      props[`is${classify(bp)}`] = val;
    });

    if (found) {
      this.setProperties(props);
    } else {
      throw new Error(
        `You tried to set the breakpoint to ${breakpoint}, which is not in your app/breakpoint.js file.`,
      );
    }
  },

  match() {}, // do not set up listeners in test

  init(...args) {
    this._super(...args);

    this._forceSetBreakpoint(this._defaultBreakpoint);
  },
});

export default registerAsyncHelper("setBreakpoint", function (app, breakpoint) {
  // this should use getOwner once that's supported
  const mediaService = app.__deprecatedInstance__.lookup("service:media");
  mediaService._forceSetBreakpoint(breakpoint);
});

export function setBreakpointForIntegrationTest(container, breakpoint) {
  const mediaService = getOwner(container).lookup("service:media");
  mediaService._forceSetBreakpoint(breakpoint);
  container.set("media", mediaService);

  return mediaService;
}
