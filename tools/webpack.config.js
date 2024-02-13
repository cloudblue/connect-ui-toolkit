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

  externals: {
    vue: 'vue',
  },
};
