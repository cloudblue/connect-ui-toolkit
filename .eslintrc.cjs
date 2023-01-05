/* eslint-env node */
module.exports = {
  "root": true,
  "ignorePatterns": ['*.config.js', '*.spec.js', 'tasks/*', 'dist/*'],
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "plugin:storybook/recommended"
  ],
  "env": {
    "vue/setup-compiler-macros": true
  },
  "rules": {
    "vue/multi-word-component-names": "off"
  }
};