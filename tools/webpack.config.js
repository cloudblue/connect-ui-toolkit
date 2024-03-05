const path = require('node:path');

module.exports = {
  mode: process.env.NODE_ENV,

  experiments: {
    outputModule: true,
  },

  entry: {
    fastApiAdapter: {
      import: path.resolve(__dirname, 'api/fastApi/adapter.js'),
      filename: 'tools/fastApi/index.js',
    },
    fastApiAdapterVue: {
      import: path.resolve(__dirname, 'api/fastApi/vue-composable.js'),
      filename: 'tools/fastApi/vue.js',
    },
    createViteConfig: {
      import: path.resolve(__dirname, 'build/vite/index.js'),
      // export as .mjs until the toolkit package is defined as ES module
      filename: 'tools/build/vite.mjs',
    },
    toolkitVuePlugin: {
      import: path.resolve(__dirname, 'vue/toolkit.js'),
      filename: 'tools/vue/toolkitPlugin.js',
    },
  },

  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    library: {
      type: 'module',
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },

  externals: [
    {
      vue: 'vue',
    },
    /node:\w*/,
  ],
};
