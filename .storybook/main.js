const path = require('path');

module.exports = {
  stories: [
    "../src/**/*.stories.@(js|jsx|ts|tsx|vue)",
    "../src/stories/**/*.mdx",
  ],

  staticDirs: ["../public"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
	  "@storybook/addon-designs",
    "@storybook/vue-addon"
  ],

  framework: {
    name: "@storybook/vue3-webpack5",
    options: {},
  },

  features: {
    interactionsDebugger: true,
  },

  webpackFinal: async (config) => {
    config.module.rules = config.module.rules.map(rule => {
      if (rule.test.toString().includes('svg')) {
        const test = rule.test.toString().replace('svg|', '').replace(/\//g, '')
        return { ...rule, test: new RegExp(test) }
      } else {
        return rule
      }
    });

    config.module.rules.push(
      {
        test: /\.svg/,
        type: 'asset/source',
        loader: 'svgo-loader',
        options: {
          configFile: require.resolve('../svgo.config.js'),
        },
      }
    );

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

    return config;
  },

  docs: {
    autodocs: true,
  },
};
