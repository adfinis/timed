"use strict";

// eslint-disable-next-line n/no-missing-require
const EmberApp = require("ember-cli/lib/broccoli/ember-app");

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
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
  });

  app.import("node_modules/simplebar/dist/simplebar.css");

  app.import("node_modules/downloadjs/download.min.js", {
    using: [{ transformation: "amd", as: "downloadjs" }],
  });

  return app.toTree();
};
