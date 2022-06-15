/* eslint-env node */
module.exports = {
  "root": true,
  "ignorePatterns": ['*.config.js', '*.spec.js', 'tasks/*'],
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended"
  ],
  "env": {
    "vue/setup-compiler-macros": true,
  },
  "rules": {
    "vue/multi-word-component-names": "off"
  }
}
