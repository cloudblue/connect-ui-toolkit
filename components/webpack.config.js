const path = require('node:path');
const { VueLoaderPlugin } = require('vue-loader');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV,

  experiments: {
    outputModule: true,
  },

  entry: path.resolve(__dirname, 'src/index.js'),

  output: {
    path: path.resolve(__dirname, '..', 'dist'),
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
              isCustomElement: (tag) => tag.startsWith('ui-'),
            },
          },
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, 'src'), path.resolve('test')],
        exclude: /node_modules/,
      },
      {
        test: /\.styl(us)?$/,
        use: ['vue-style-loader', 'css-loader', 'stylus-loader'],
      },
      {
        test: /\.svg/,
        type: 'asset/source',
        loader: 'svgo-loader',
        options: {
          configFile: path.resolve(__dirname, 'svgo.config.js'),
        },
      },
    ],
  },

  resolve: {
    alias: {
      '~core': path.resolve(__dirname, 'src/core'),
      '~widgets': path.resolve(__dirname, 'src/widgets'),
      '~constants': path.resolve(__dirname, 'src/constants'),
    },
  },

  plugins: [
    new VueLoaderPlugin(),

    new ESLintPlugin({
      extensions: ['js', 'vue'],
    }),
  ],
};
