const path = require('node:path');


module.exports = {
  mode: process.env.NODE_ENV,

  experiments: {
    outputModule: true,
  },

  entry: {
    fastApi: {
      import: path.resolve(__dirname, 'api/fastApi/index.js'),
      filename: 'tools/[name].js',
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
};
