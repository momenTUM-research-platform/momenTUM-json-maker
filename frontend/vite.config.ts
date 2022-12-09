/**
 * @type {import('vite').UserConfig}
 */
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react(), tsconfigPaths()],
  build: {
    commonjsOptions: {
      target: "es2018",
      ignoreTryCatch: false, // https://stackoverflow.com/questions/72170009/how-can-i-include-dagre-graphlib-in-a-vue-js-site-built-with-vite
    },
  },
}));
