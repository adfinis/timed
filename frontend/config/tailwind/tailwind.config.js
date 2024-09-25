"use strict";
// located in <app root>/config/tailwind/

const path = require("path");

const appRoot = path.join(__dirname, "../../");
const appEntry = path.join(appRoot, "app");
const relevantFilesGlob = "**/*.{html,js,ts,hbs,gjs,gts}";

module.exports = {
  content: [path.join(appEntry, relevantFilesGlob)],
  theme: {
    theme: {
      fontFamily: {
        sans: ["Source Sans Pro"],
      },
      extend: {
        colors: {
          adfinis: {
            blue: "#2e4b98",
            darkblue: "#1c2e5d",
            green: "#2e987b",
            grey: "#f5f6f5",
            darkgrey: "#8b8b8c",
            black: "#0f0f0f",
            white: "#f8f7f7",
          },
          black: "#0f0f0f",
          white: "#f8f7f7",
        },
      },
    },
  },
};
