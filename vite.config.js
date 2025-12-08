import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'assets/img/**/*',
          dest: 'assets/img'
        },
        {
          src: 'assets/js/data/**/*',
          dest: 'assets/js/data'
        },
        {
          src: 'assets/svg/**/*',
          dest: 'assets/svg'
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'assets')
    }
  },
  server: {
    open: true
  }
});

