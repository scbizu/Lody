import { fileURLToPath } from 'node:url';
import stylex from '@stylexjs/unplugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { stylexOptions } from '../../../ui/stylex-options';

export default defineConfig({
  base: './',
  plugins: [react(), stylex.vite({ ...stylexOptions, dev: false }), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('../../src', import.meta.url)),
    },
    dedupe: ['react', 'react-dom'],
  },
});
