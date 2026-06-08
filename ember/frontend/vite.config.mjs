// ember/frontend/vite.config.mjs
import path from "node:path";

import { extensions, classicEmberSupport, ember } from "@embroider/vite";
import { babel } from "@rollup/plugin-babel";

// Use standard ESM imports instead of require()
import autoprefixer from "autoprefixer";
import postcssImport from "postcss-import";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://timed.localhost",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      noUiSlider: path.resolve(
        __dirname,
        "node_modules/nouislider/dist/nouislider.mjs",
      ),
      "ui-core": path.resolve(__dirname, "node_modules/ui-core/dist"),
    },
  },
  css: {
    postcss: {
      plugins: [
        postcssImport(), // Runs first, grabs your CSS @imports
        tailwindcss("./config/tailwind.config.js"),
        autoprefixer(),
      ],
    },
  },
  optimizeDeps: {
    exclude: [
      "ui-core",
      "@ember/debug",
      "@ember/application",
      "@ember/service",
      "@ember/object",
      "@ember/component",
      "@ember/component/helper",
      "@ember/utils",
      "ember-testing",
      "@embroider/virtual",
    ],
    include: ["nouislider"],
  },
  plugins: [
    classicEmberSupport(),
    ember(),
    babel({
      babelHelpers: "runtime",
      extensions,
    }),
  ],
});
