import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { env } from 'process';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/execute': {
        target: env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
