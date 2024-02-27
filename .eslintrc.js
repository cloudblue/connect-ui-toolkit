module.exports = {
  root: true,

  // Ignore every file but the patterns specified after '/*'
  ignorePatterns: [
    '/*',
    '!/components', // all files inside /components
    '!/tools', // all files inside /tools
    '!/*.js', // all JS files in root dir
  ],

  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'plugin:storybook/recommended',
  ],

  plugins: ['vue'],
  parser: 'vue-eslint-parser',

  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-deprecated-slot-attribute': 'off',
  },

  overrides: [
    // Config for unit tests
    {
      files: ['*.spec.js'],
      plugins: ['jest'],
      extends: [
        'plugin:jest/recommended',
        'plugin:jest-formatting/strict',
      ],
      env: {
        jest: true,
        'jest/globals': true,
      },
      globals: {
        global: 'writable',
      },
    },

    // Config for files that run in node env (config files, etc)
    {
      files: ['*.config.js', '.eslintrc.js'],
      env: {
        node: true,
      },
    },
  ],
};
