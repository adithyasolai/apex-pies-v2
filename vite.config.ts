import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: 'build',
  },
  server: {
    proxy: {
      '/fetchnumsaved': 'http://127.0.0.1:5001',
      '/fetchpies':     'http://127.0.0.1:5001',
      '/savepie':       'http://127.0.0.1:5001',
      '/fetchsavedpie': 'http://127.0.0.1:5001',
    },
  },
});
