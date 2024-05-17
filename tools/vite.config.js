import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        'fastApi/adapter': resolve(__dirname, 'api/fastApi/adapter.js'),
        'fastApi/vue-composable': resolve(__dirname, 'api/fastApi/vue-composable.js'),
        'build/vite': resolve(__dirname, 'build/vite/index.js'),
        'vite/toolkit': resolve(__dirname, 'vue/toolkit.js'),
      },
      fileName: (_, entryName) => {
        return `tools/${entryName}.js`;
      },
    },
    rollupOptions: {
      output: {
        dir: resolve(__dirname, '..', 'dist'),
      },
      external: ['vue', /node:\w*/],
    },
  },
});
