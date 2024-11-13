"use strict";
// located in <app root>/config/tailwind/

const path = require("path");

const forms = require("@tailwindcss/forms");

const appRoot = path.join(__dirname, "../");
const appEntry = path.join(appRoot, "app");
const relevantFilesGlob = "**/*.{html,js,ts,hbs,gjs,gts}";

const borderColor =
  "color-mix(in srgb, rgb(var(--background) / <alpha-value>), rgb(var(--foreground-muted)))";

module.exports = {
  content: [path.join(appEntry, relevantFilesGlob)],
  darkMode: "class",
  theme: {
    extend: {
      borderRadius: {
        DEFAULT: "var(--border-radius)",
      },
      fontFamily: {
        sans: ['"Source Sans 3"', "sans-serif"],
        mono: ["'Source Code Pro'", "monospace"],
      },
      keyframes: {
        loading: {
          "0%, 100%": { transform: "scale(0.1)", opacity: "1" },
          "50%": { transform: "scale(0.9)", opacity: "0" },
        },
      },
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
      borderColor: {
        DEFAULT: borderColor,
      },
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        "background-muted": "rgb(var(--background-muted) / <alpha-value>)",
        "background-secondary":
          "rgb(var(--background-secondary) / <alpha-value>)",
        border: borderColor,
        danger: "rgb(var(--danger) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        "foreground-primary": "rgb(var(--foreground-primary) / <alpha-value>)",
        "foreground-muted": "rgb(var(--foreground-muted) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        white: "rgb(var(--white) / <alpha-value>)",
        black: "rgb(var(--black) / <alpha-value>)",
        // hacky, rethink
        "foreground-mid":
          "color-mix(in oklab, rgb(var(--foreground)), rgb(var(--foreground-muted)))",

        // override border colour used by @tailwindcss/forms
        gray: {
          500: borderColor,
        },
      },
    },
  },
  plugins: [forms()],
  safelist: [{ pattern: /noUi-/ }, { pattern: /ember-/ }, "invalid-feedback"],
};
