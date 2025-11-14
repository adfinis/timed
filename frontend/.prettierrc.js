"use strict";

module.exports = {
  plugins: [
    "prettier-plugin-ember-template-tag",
    "prettier-plugin-tailwindcss",
  ],
  overrides: [
    {
      files: "*.{js,gjs,ts,gts,mjs,mts,cjs,cts}",
      options: {
        templateSingleQuote: false,
      },
    },
  ],
};
