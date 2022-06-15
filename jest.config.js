const path = require("path");
module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'vue',
  ],

  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.js$': 'babel-jest',
  },

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/core/$1',
    '^~modules$': '<rootDir>/src/modules',
    '^~modules/(.*)$': '<rootDir>/src/modules/$1',
    '^~widgets$': '<rootDir>./src/widgets',
    '^~widgets/(.*)$': '<rootDir>./src/widgets$1',
  },

  clearMocks: true,

  testMatch: [
    '<rootDir>/(**/*\\.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx))',
  ],

  collectCoverage: true,

  collectCoverageFrom: [
    'src/**/*.{js,vue}',
  ],

  coverageDirectory: '<rootDir>/test/coverage/',

  coveragePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/helpers/',
    '<rootDir>/node_modules/',
  ],

  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
