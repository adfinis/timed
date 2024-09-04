"use-strict";

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["ember", "@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:ember/recommended",
    "plugin:prettier/recommended",
  ],
  env: {
    browser: true,
  },
  rules: {
    // possible errors
    "no-await-in-loop": "error",

    // best practices
    "array-callback-return": "error",
    "dot-notation": "error",
    eqeqeq: "error",
    "no-alert": "error",
    "no-else-return": "error",
    "no-eval": "error",
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-floating-decimal": "error",
    "one-var": ["error", "never"],
    curly: ["error", "multi-line"],

    // ES6
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-const": "error",
    "prefer-destructuring": [
      "error",
      { AssignmentExpression: { array: false, object: false } },
    ],
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "prefer-template": "error",

    // import
    "import/no-duplicates": "error",
    "import/no-unresolved": "off",
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],

    // tooling
    "no-console": ["error", { allow: ["warn", "error"] }],
    "no-debugger": "error",
  },
  overrides: [
    // js files
    {
      files: ["**/*.js"],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
      ],
      rules: {},
    },
    // ts files
    {
      files: ["**/*.ts"],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
      ],
      rules: {},
    },
    // node files
    {
      files: [
        "./.eslintrc.js",
        "./.prettierrc.js",
        "./.stylelintrc.js",
        "./.template-lintrc.js",
        "./ember-cli-build.js",
        "./testem.js",
        "./blueprints/*/index.js",
        "./config/**/*.js",
        "./lib/*/index.js",
        "./server/**/*.js",
      ],
      env: {
        browser: false,
        node: true,
      },
      extends: ["plugin:n/recommended"],
    },
    {
      // test files
      files: ["tests/**/*-test.{js,ts}"],
      extends: ["plugin:qunit/recommended"],
    },
  ],
};
