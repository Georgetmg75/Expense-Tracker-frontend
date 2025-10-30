import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'], // ✅ Prevents hook errors from duplicate React versions
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // ✅ Local dev proxy
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    'process.env': {}, // ✅ Prevents Vite from crashing if process.env is referenced
  },
});
