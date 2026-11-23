import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build`        -> dist/         (deployable static site, relative paths so it works on any host / sub-path)
// `npm run build:single` -> dist-single/  (one self-contained HTML file you can double-click)
export default defineConfig(({ mode }) => {
  const single = mode === 'single';
  return {
    base: './',
    plugins: [react(), ...(single ? [viteSingleFile()] : [])],
    build: single
      ? { outDir: 'dist-single', assetsInlineLimit: 100_000_000, cssCodeSplit: false, chunkSizeWarningLimit: 4000 }
      : { outDir: 'dist', chunkSizeWarningLimit: 1200 },
  };
});
