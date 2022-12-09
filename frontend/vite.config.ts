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
            if (id.includes("integration/jquery")) {
              return { moduleSideEffects: "no-treeshake" };
            }
            if (id.includes("ui/data_grid")) {
              return { moduleSideEffects: "no-treeshake" };
            }
          },
        },
      ],
    },
  },
}));
