"use strict";

module.exports = {
  settings: {
    "import/internal-regex": "^customer-center/",
  },
  extends: ["@adfinis/eslint-config/ember-app"],
  rules: {
    "ember/no-settled-after-test-helper": "warn",
    "no-unused-vars": "off",
    "prefer-rest-params": "off",
    "ember/use-brace-expansion": "off",
    "ember/no-get": "off",
    "ember/no-mixins": "warn",
  },
};
