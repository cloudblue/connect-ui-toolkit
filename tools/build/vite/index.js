/* eslint-env node */
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

import { flatten as flattenHtmlPagesDirectoryPlugin } from './flatten-html-pages-directory.js';

const checkIfIsProduction = (mode) => {
  if (mode) return mode === 'production';
  if (process.env.NODE_ENV) return process.env.NODE_ENV === 'production';

  return false;
};

/**
 * Creates a valid vite config set up for a Connect extension that uses Vite + Vue
 *
 * @param {object} config - main configuration object
 * @param {string} config.srcDir - absolute path for the src folder
 * @param {URL} config.srcUrl - URL for the src folder, used for aliasing '~'
 * @param {string} config.outputDir - absolute path for the output directory
 * @param {object} config.vuePlugin - '@vitejs/vue' plugin instance
 * @param {object} viteOptions - your custom vite config options
 *
 * @returns {function({mode: ('development'|'production')}): {resolve: *&{alias: *&{"~": string}}, build: *&{minify: string|boolean, emptyOutDir: boolean, sourcemap, rollupOptions: *&{output: *&{manualChunks(*): (string|undefined), format: string, dir: *}, input: {}}, outDir: *}, plugins, root: *, base: string}} - Valid vite config set up for a connect extension
 */
export const defineExtensionConfig =
  (config, viteOptions = {}) =>
  ({ mode }) => {
    const { srcDir, srcUrl, outputDir, vuePlugin } = config;

    if (!srcDir) throw new Error('"srcDir" is required');
    if (!outputDir) throw new Error('"outputDir" is required');
    if (!vuePlugin) throw new Error('"vuePlugin" is required');
    if (!srcUrl) throw new Error('"srcUrl" is required');

    const isProduction = checkIfIsProduction(mode);

    return {
      ...viteOptions,

      resolve: {
        ...viteOptions.resolve,

        alias: {
          ...viteOptions.resolve?.alias,

          '~': fileURLToPath(srcUrl),
        },
      },

      plugins: [vuePlugin, flattenHtmlPagesDirectoryPlugin, ...(viteOptions.plugins || [])],

      root: srcDir,
      base: '/static',

      build: {
        // Enable minification on production builds
        minify: isProduction ? 'esbuild' : false,
        // Enable sourcemaps on non-production builds
        sourcemap: !isProduction,

        ...viteOptions.build,

        outDir: outputDir,
        emptyOutDir: true,

        rollupOptions: {
          ...viteOptions.build?.rollupOptions,

          // Load all pages in {{srcDir}}/pages/{{pageName}}/index.html as entrypoints
          input: fs.readdirSync(path.resolve(srcDir, 'pages')).reduce((entryPoints, pageName) => {
            entryPoints[pageName] = path.resolve(srcDir, 'pages/', pageName, 'index.html');

            return entryPoints;
          }, {}),

          output: {
            ...viteOptions.build?.rollupOptions?.output,

            format: 'es',
            dir: outputDir,

            // Split node_modules into a "vendor" chunk, and @cloudblueconnect modules into a "connect" chunk
            manualChunks(id) {
              if (id.includes('@cloudblueconnect')) return 'connect';
              if (id.includes('node_modules')) return 'vendor';
            },
          },
        },
      },
    };
  };
