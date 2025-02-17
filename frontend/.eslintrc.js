"use-strict";

module.exports = {
  extends: ["@adfinis/eslint-config/ember-app"],
  rules: {
    "ember/no-component-lifecycle-hooks": "warn",
    "ember/no-get": "warn",
    "ember/no-observers": "warn",
    "qunit/no-assert-equal": "warn",
    "ember/require-tagless-components": "warn",
  },
};
