/**
 * @type {import('vite').UserConfig}
 */
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      plugins: [
        {
          name: "no-treeshake",
          transform(_, id) {
            if (id.includes("@mui/icons-material")) {
              return { moduleSideEffects: "no-treeshake" };
            }
            if (id.includes("@mui/material")) {
              return { moduleSideEffects: "no-treeshake" };
            }
          },
        },
      ],
    },
    commonjsOptions: {
      target: "es2018",
      ignoreTryCatch: false, // https://stackoverflow.com/questions/72170009/how-can-i-include-dagre-graphlib-in-a-vue-js-site-built-with-vite
    },
  },
}));
