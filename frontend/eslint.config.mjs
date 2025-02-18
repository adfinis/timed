import adfinisEmberAppConfig from "@adfinis/eslint-config/ember-app";
import ember from "eslint-plugin-ember";

export default [
  ...adfinisEmberAppConfig,
  {
    plugins: { ember },
    settings: {
      "import/internal-regex": "^timed/",
    },
    rules: {
      "ember/no-observers": "warn",
    },
  },
];
