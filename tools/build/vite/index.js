import { fileURLToPath } from 'node:url';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import flattenHtmlPagesDirectoryPlugin from './flatten-html-pages-directory';


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
 * @returns {object} - Valid vite config set up for a connect extension
 */
export const defineExtensionConfig = (config, viteOptions = {}) => {
  const {
    srcDir,
    srcUrl,
    outputDir,
    vuePlugin,
  } = config;

  if (!srcDir) throw new Error('"srcDir" is required');
  if (!outputDir) throw new Error('"outputDir" is required');
  if (!vuePlugin) throw new Error('"vuePlugin" is required');
  if (!srcUrl) throw new Error('"srcUrl" is required');


  return {
    ...viteOptions,

    resolve: {
      ...viteOptions.resolve,

      alias: {
        ...viteOptions.resolve?.alias,

        '~': fileURLToPath(srcUrl),
      },
    },

    plugins: [
      vuePlugin,
      flattenHtmlPagesDirectoryPlugin,
      ...(viteOptions.plugins || []),
    ],

    root: srcDir,
    base: '/static',

    build: {
      ...viteOptions.build,

      outDir: outputDir,
      emptyOutDir: true,

      rollupOptions: {
        ...viteOptions.build?.rollupOptions,

        // Load all pages in {{srcDir}}/pages/{{pageName}}/index.html as entrypoints
        input: readdirSync(resolve(srcDir, 'pages')).reduce((entryPoints, pageName) => {
          entryPoints[pageName] = resolve(srcDir, 'pages/', pageName, 'index.html');

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
