import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';

import componentsViteConfig from './components/vite.config';
import toolsViteConfig from './tools/vite.config';

export default defineConfig(
  mergeConfig(
    mergeConfig(componentsViteConfig, toolsViteConfig),
    defineConfig({
      test: {
        globals: true,
        globalSetup: resolve(__dirname, './vitest-global-setup.js'),
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'e2e/*'],
        root: fileURLToPath(new URL('.', import.meta.url)),
        reporters: ['json', 'default'],
        outputFile: resolve(__dirname, './test/report.json'),
        coverage: {
          enabled: false,
          provider: 'v8',
          reportsDirectory: resolve(__dirname, './test/coverage'),
        },
        clearMocks: true,
      },
    }),
  ),
);
