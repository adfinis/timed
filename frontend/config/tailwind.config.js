"use strict";
// located in <app root>/config/tailwind/

const path = require("path");

const forms = require("@tailwindcss/forms");

const appRoot = path.join(__dirname, "../");
const appEntry = path.join(appRoot, "app");
const relevantFilesGlob = "**/*.{html,js,ts,hbs,gjs,gts}";

module.exports = {
  content: [path.join(appEntry, relevantFilesGlob)],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Source Sans Pro", "sans-serif"],
        mono: ["Menlo", "Monaco", "Consolas", "Courier New", "monospace"],
      },
      colors: {
        background: "var(--background)",
        border: "var(--border)",
        danger: "var(--danger)",
        foreground: "var(--foreground)",
        "foreground-muted": "var(--foreground-muted)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        success: "var(--success)",
        warning: "var(--warning)",
      },
    },
  },
  plugins: [forms()],
  safelist: [{ pattern: /noUi-/ }],
};
