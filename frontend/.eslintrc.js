"use-strict";

module.exports = {
  extends: ["@adfinis/eslint-config/ember-app"],
  rules: {
    "ember/no-observers": "warn",
    "qunit/no-assert-equal": "warn",
  },
};
