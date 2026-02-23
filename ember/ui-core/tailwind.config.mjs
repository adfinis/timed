"use strict";

import forms from "@tailwindcss/forms";

const colorMixOpacity = (color) =>
  `color-mix(in srgb, ${color} calc(100% * <alpha-value>), transparent)`;

const borderColor = colorMixOpacity("var(--border)");

export const content = [
  "index.html",
  "src/**/*.{css,gjs,gts,js,ts}",
  "demo-app/**/*.{css,gjs,gts,js,ts}",
];
export const darkMode = "class";
export const theme = {
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
      background: {
        DEFAULT: "rgb(var(--background) / <alpha-value>)",
        muted: colorMixOpacity("var(--background-muted)"),
        secondary: "rgb(var(--background-secondary) / <alpha-value>)",
      },
      border: borderColor,
      danger: {
        DEFAULT: colorMixOpacity("var(--danger)"),
        accent: colorMixOpacity("var(--danger-accent)"),
        light: colorMixOpacity("var(--danger-light)"),
      },
      foreground: {
        DEFAULT: colorMixOpacity("var(--foreground)"),
        primary: "rgb(var(--foreground-primary) / <alpha-value>)",
        muted: "rgb(var(--foreground-muted) / <alpha-value>)",
        secondary: "rgb(var(--foreground-secondary) / <alpha-value>)",
        accent: colorMixOpacity("var(--foreground-accent)"),
      },
      primary: {
        DEFAULT: colorMixOpacity("var(--primary)"),
        dark: colorMixOpacity("var(--primary-dark)"),
        light: colorMixOpacity("var(--primary-light)"),
      },
      secondary: {
        DEFAULT: colorMixOpacity("var(--secondary)"),
        dark: colorMixOpacity("var(--secondary-dark)"),
        light: colorMixOpacity("var(--secondary-light)"),
      },
      tertiary: {
        DEFAULT: colorMixOpacity("var(--tertiary)"),
        dark: colorMixOpacity("var(--tertiary-dark)"),
        light: colorMixOpacity("var(--tertiary-light)"),
      },
      success: {
        DEFAULT: colorMixOpacity("var(--success)"),
        accent: colorMixOpacity("var(--success-accent)"),
        light: colorMixOpacity("var(--success-light)"),
      },
      warning: {
        DEFAULT: colorMixOpacity("var(--warning)"),
        accent: colorMixOpacity("var(--warning-accent)"),
        light: colorMixOpacity("var(--warning-light)"),
      },
      white: "rgb(var(--white) / <alpha-value>)",
      black: "rgb(var(--black) / <alpha-value>)",
      overview: {
        workday: {
          DEFAULT: colorMixOpacity("var(--overview-workday)"),
          active: colorMixOpacity("var(--overview-workday-active)"),
          hf: colorMixOpacity("var(--overview-workday-hf)"),
        },
        absence: {
          DEFAULT: colorMixOpacity("var(--overview-absence)"),
          active: colorMixOpacity("var(--overview-absence-active)"),
          hf: colorMixOpacity("var(--overview-absence-hf)"),
        },
        weekend: {
          DEFAULT: colorMixOpacity("var(--overview-weekend)"),
          active: colorMixOpacity("var(--overview-weekend-active)"),
          hf: colorMixOpacity("var(--overview-weekend-hf)"),
        },
        active: colorMixOpacity("var(--overview-active)"),
        hf: colorMixOpacity("var(--overview-hf)"),
      },

      // override border colour used by @tailwindcss/forms
      gray: {
        500: borderColor,
      },
    },
  },
};
export const plugins = [forms()];
export const safelist = [
  { pattern: /alert-/ },
  { pattern: /ember-/ },
  { pattern: /noUi-/ },
  { pattern: /shepherd-/ },
  "invalid-feedback",
];
