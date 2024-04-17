import path from 'node:path';
import url from 'node:url';
import vue from '@vitejs/plugin-vue';
import svg from 'vite-plugin-svgo';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '~core': url.fileURLToPath(new URL('./src/core', import.meta.url)),
      '~widgets': url.fileURLToPath(new URL('./src/widgets', import.meta.url)),
      '~constants': url.fileURLToPath(new URL('./src/constants', import.meta.url)),
      '~composables': url.fileURLToPath(new URL('./src/composables', import.meta.url)),
    },
  },
  plugins: [
    vue({
      customElement: true,
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('ui-'),
        },
      },
    }),
    svg({
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
            },
          },
        },
        {
          name: 'prefixIds',
        },
      ],
    }),
  ],
  build: {
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        dir: path.resolve(__dirname, '..', 'dist'),
      },
      external: ['vue', /node:\w*/],
    },
  },
});
