import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

/**
 * Vite configuration for Designer frontend
 * - Listens on all interfaces (host: true)
 * - Whitelists all necessary preview hosts
 */
export default defineConfig(({ mode }) => ({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,     // listen on 0.0.0.0 for dev
    port: 3000,
  },
  preview: {
    host: true,     // listen on 0.0.0.0 for preview
    port: 3000,
    allowedHosts: [ // hostnames for preview
      '127.0.0.1',
      'localhost',
      '0.0.0.0',
      '::1',
      'designer.127.0.0.1.nip.io',
      'designer.localtest.me',
      'designer.momentumresearch.eu'
    ],
  },
  test: {
    // Jest-like globals
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    include: ['**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'no-treeshake',
          transform(_, id) {
            if (id.includes('@mui/icons-material') || id.includes('@mui/material')) {
              return { moduleSideEffects: 'no-treeshake' };
            }
          },
        },
      ],
    },
    commonjsOptions: {
      target: 'es2018',
      ignoreTryCatch: false, // allow including dagre-graphlib etc.
    },
  },
}));
