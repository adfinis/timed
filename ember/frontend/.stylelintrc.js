"use strict";

module.exports = {
  extends: ["stylelint-config-standard"],
  rules: {
    "custom-property-empty-line-before": null, // we use empty lines to group/order properties
    "at-rule-empty-line-before": ["never", { ignoreAtRules: ["import"] }], // we use empty lines to group/order imports (su)
    "selector-class-pattern": null, // we can ignore this because most css is styling 3rd party components where we don't control the class names
    "import-notation": null, // doesn't really work with postcss-import
    "at-rule-no-deprecated": [
      true,
      {
        ignoreAtRules: ["apply"], // ignore tailwind decorators
      },
    ],
    "function-no-unknown": [
      true,
      {
        ignoreFunctions: ["theme"], // ignore tailwind functions
      },
    ],
  },
};
