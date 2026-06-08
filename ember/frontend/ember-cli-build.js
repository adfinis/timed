"use strict";
const EmberApp = require("ember-cli/lib/broccoli/ember-app");
const { setConfig } = require("@warp-drive/build-config");

const { compatBuild } = require("@embroider/compat");

module.exports = async function (defaults) {
  const { buildOnce } = await import("@embroider/vite");

  const app = new EmberApp(defaults, {
    emberData: {
      deprecations: {
        // New projects can safely leave this deprecation disabled.
        // If upgrading, to opt-into the deprecated behavior, set this to true and then follow:
        // https://deprecations.emberjs.com/id/ember-data-deprecate-store-extends-ember-object
        // before upgrading to Ember Data 6.0
        DEPRECATE_STORE_EXTENDS_EMBER_OBJECT: false,
      },
    },
    babel: {
      plugins: [
        require.resolve("ember-concurrency/async-arrow-task-transform"),
      ],
    },
    // sassOptions: {
    //   onlyIncluded: true,
    // },
    "ember-simple-auth": {
      useSessionSetupMethod: true,
    },
    "ember-validated-form": {
      theme: "bootstrap",
    },
  });

  setConfig(app, __dirname, { compatWith: "3.12" });
  return compatBuild(app, buildOnce, {
    packageRules: [
      {
        package: "ui-core",
        semverRange: "*",
        // Prevents Embroider from attempting to parse its assets through the Ember engine
        addonModules: {},
        components: {},
      },
    ],
  });
};
