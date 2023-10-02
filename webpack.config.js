const { VueLoaderPlugin } = require('vue-loader');
const ESLintPlugin = require('eslint-webpack-plugin');

const { resolve } = require("path");

module.exports = {
  mode: process.env.NODE_ENV,

  experiments: {
    outputModule: true,
  },

  entry: './src/index.js',

  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      type: 'module',
    },
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            customElement: true,
            compilerOptions: {
              isCustomElement: tag => tag.startsWith('ui-'),
            },
          },
        },
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
      {
        test: /\.svg/,
        type: 'asset/source',
        loader: 'svgo-loader',
        options: {
          configFile: resolve(__dirname, 'svgo.config.js'),
        },
      },
    ],
  },

  resolve: {
    alias: {
      '~core': resolve(__dirname, './src/core'),
      '~widgets': resolve(__dirname, './src/widgets'),
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

    static: ['dist'],

    historyApiFallback: {
      rewrites: [{ from: /./, to: '/index.js' }],
    },
  },
};
