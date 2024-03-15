/** @type {import('jest').Config} */
import url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
  rootDir: __dirname,
  displayName: 'components',

  moduleFileExtensions: ['js', 'json', 'vue'],

  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },

  transformIgnorePatterns: ['/node_modules/(?!(@cloudblueconnect)/)'],

  moduleNameMapper: {
    '^~widgets/(.*)$': '<rootDir>./src/widgets/$1',
    '^~core/(.*)$': '<rootDir>./src/core/$1',
    '^~constants/(.*)$': '<rootDir>./src/constants/$1',
    // This replaces import of files from @cloudblueconnect/material-svg in .spec.js files to optimize the run time of all unit tests
    '^.+\\.svg$': '<rootDir>/test/helpers/svgMock.js',
  },

  clearMocks: true,

  collectCoverageFrom: ['<rootDir>/src/**/*.{js,vue}'],

  testMatch: ['<rootDir>/(**/*\\.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx))'],

  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
    customExportConditions: ['node', 'node-addons'],
  },

  globals: {
    'vue-jest': {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith('ui-'),
      },
    },
  },
};
