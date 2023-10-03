const path = require('path');

module.exports = {
  stories: [
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/stories/**/*.mdx",
  ],

  staticDirs: ["../public"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-designs",
  ],

  framework: {
    name: "@storybook/vue3-webpack5",
    options: {},
  },

  features: {
    interactionsDebugger: true,
  },

  webpackFinal: async (config) => {

    config.module.rules.push({
      test: /\.styl(us)$/,
      use: [
        'vue-style-loader',
        'css-loader',
        'stylus-loader',
      ],
      include: path.resolve(__dirname, '../'),
    });

    config.module.rules.push(
      {
        test: /\.pug$/,
        use: [
          { loader: 'pug-plain-loader' }
        ]
      }
    );

    config.resolve.alias = {
      'vue': path.resolve(__dirname, '../node_modules/vue/dist/vue.esm-bundler.js'),
      '~core': path.resolve(__dirname, '../src/core'),
      '~widgets': path.resolve(__dirname, '../src/widgets'),
    };

    return config;
  },

  docs: {
    autodocs: true,
  },
};
