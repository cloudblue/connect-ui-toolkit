const { VueLoaderPlugin } = require('vue-loader');
const ESLintPlugin = require('eslint-webpack-plugin');

const path = require("path");
const { resolve } = require("path");

module.exports = {
  mode: 'development',
  experiments: {
    outputModule: true,
  },

  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      type: 'module',
    },
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('app'), resolve('test')],
        exclude: /node_modules/,
      },
      {
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'stylus-loader',
        ],
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader',
      },
    ],
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/core'),
      '~modules': path.resolve(__dirname, './src/modules'),
      '~widgets': path.resolve(__dirname, './src/widgets'),
    },
  },

  plugins: [
    new VueLoaderPlugin(),

    new ESLintPlugin({
      extensions: ['js', 'vue'],
    }),
  ],
  devServer: {
    hot: true,

    allowedHosts: 'all',

    headers: {
      "Access-Control-Allow-Origin": "*",
    },

    historyApiFallback: {
      index: '/',
    },
  },
}