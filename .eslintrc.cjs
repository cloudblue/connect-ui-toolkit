require('@rushstack/eslint-patch/modern-module-resolution');

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
    'prettier',
    '@vue/eslint-config-prettier/skip-formatting',
    'plugin:vitest-globals/recommended',
  ],

  plugins: ['vue'],
  parser: 'vue-eslint-parser',

  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-deprecated-slot-attribute': 'off',
    'vue/block-order': [
      'error',
      {
        order: ['template', 'script', 'style'],
      },
    ],
    'vue/attribute-hyphenation': ['error', 'never'],
  },

  env: {
    'vitest-globals': true,
  },

  parserOptions: {
    ecmaVersion: 'latest',
  },

  overrides: [
    // Config for files that run in node env (config files, etc)
    {
      files: ['*.config.js', '.eslintrc.js'],
      env: {
        node: true,
      },
    },
  ],
};
