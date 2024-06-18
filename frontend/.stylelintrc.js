"use strict";

module.exports = {
  plugins: ["stylelint-prettier"],
  extends: ["stylelint-prettier/recommended", "stylelint-config-standard-scss"],
  rules: {
    "scss/at-extend-no-missing-placeholder": null,
    "selector-class-pattern": null,
  },
};
