"use strict";

const EmberApp = require("ember-cli/lib/broccoli/ember-app");

module.exports = function (defaults) {
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
    postcssOptions: {
      compile: {
        plugins: [
          { module: require("postcss-import") },
          {
            module: require("tailwindcss"),
            options: {
              config: "./config/tailwind.config.js",
            },
          },
          { module: require("autoprefixer"), options: {} },
        ],
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
    "ember-fetch": {
      preferNative: true,
    },
    "ember-simple-auth": {
      useSessionSetupMethod: true,
    },
    "ember-validated-form": {
      theme: "bootstrap",
    },
    autoImport: {
      alias: {
        "ember-composable-helpers": "@nullvoxpopuli/ember-composable-helpers",
      },
    },
  });

  app.import("node_modules/simplebar/dist/simplebar.css");

  app.import("node_modules/downloadjs/download.min.js", {
    using: [{ transformation: "amd", as: "downloadjs" }],
  });

  return app.toTree();
};
