"use strict";
// located in <app root>/config/tailwind/

const path = require("path");

const forms = require("@tailwindcss/forms");
const colors = require("tailwindcss/colors");

const appRoot = path.join(__dirname, "../../");
const appEntry = path.join(appRoot, "app");
const relevantFilesGlob = "**/*.{html,js,ts,hbs,gjs,gts}";

module.exports = {
  content: [path.join(appEntry, relevantFilesGlob)],
  safelist: [{ pattern: /ember-/ }, { pattern: /noUi-/ }],
  plugins: [forms()],
  theme: {
    extend: {
      fontSize: {
        "2xs": [
          "0.65rem",
          {
            lineHeight: "0.9rem",
          },
        ],
        "3xs": [
          "0.6rem",
          {
            lineHeight: "0.8rem",
          },
        ],
        "4xs": [
          "0.55rem",
          {
            lineHeight: "0.7rem",
          },
        ],
      },
      colors: {
        adfinis: {
          blue: "#2e4b98",
          darkblue: "#1c2e5d",
          green: "#2e987b",
          grey: "#f5f6f5",
          darkgrey: "#8b8b8c",
          black: "#0f0f0f",
        },
        black: "#0f0f0f",
        danger: colors.red[500],
        warning: "#ed9140",
        primary: "#2e4b98",
        "primary-muted": "#6b73ad",
        success: "#2e987b",
      },
    },
    fontFamily: {
      sans: ["Source Sans Pro"],
    },
  },
};
