import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 5173,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY || 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === 'development' && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (
            id.includes('react') ||
            id.includes('react-dom') ||
            id.includes('scheduler')
          ) {
            return 'vendor-react';
          }

          if (id.includes('react-router-dom') || id.includes('@remix-run')) {
            return 'vendor-router';
          }

          if (
            id.includes('framer-motion') ||
            id.includes('/motion/') ||
            id.includes('gsap') ||
            id.includes('lenis') ||
            id.includes('ogl') ||
            id.includes('three') ||
            id.includes('lightswind')
          ) {
            return 'vendor-animation';
          }

          if (id.includes('@radix-ui') || id.includes('lucide-react')) {
            return 'vendor-ui';
          }

          return 'vendor-misc';
        },
      },
    },
  },
}));
