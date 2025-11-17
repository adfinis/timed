"use strict";

const EmberApp = require("ember-cli/lib/broccoli/ember-app");

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    hinting: false,
    tests: process.env.EMBER_ENV === "test",
  });

  return app.toTree();
};
