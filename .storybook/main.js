export default {
  stories: [
    '../components/src/**/*.stories.@(js|jsx|ts|tsx|vue)',
    '../components/src/stories/**/*.mdx',
  ],

  staticDirs: ['../public'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    { name: '@storybook/addon-designs', options: { renderTarget: 'tab' } },
  ],

  framework: {
    name: '@storybook/vue3-vite',
    options: {
      builder: {
        viteConfigPath: './components/vite.config.js',
      },
    },
  },

  features: {
    interactionsDebugger: true,
  },

  docs: {
    autodocs: true,
  },
};
