import path from 'node:path';
import { VueLoaderPlugin } from 'vue-loader';
import ESLintPlugin from 'eslint-webpack-plugin';
import url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
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
