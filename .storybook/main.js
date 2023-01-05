const path = require('path');

module.exports = {
  stories: 
  ["../src/**/*.stories.@(js|jsx|ts|tsx)",
  "../src/**/*.stories.mdx",],
  staticDirs: ["../public"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/vue3",
  core: {
    builder: "@storybook/builder-webpack5",
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

    return config;
  },
};
