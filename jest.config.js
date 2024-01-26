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

  transformIgnorePatterns: [
    "/node_modules/(?!(@cloudblueconnect)/)"
  ],

  moduleNameMapper: {
    '^~widgets/(.*)$': '<rootDir>./src/widgets/$1',
    '^~core/(.*)$': '<rootDir>./src/core/$1',
    '^~constants/(.*)$': '<rootDir>./src/constants/$1',
    // This replaces import of files from @cloudblueconnect/material-svg in .spec.js files to optimize the run time of all unit tests
    '^.+\\.svg$': '<rootDir>/test/helpers/svgMock.js',
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
    '<rootDir>/src/stories/',
  ],

  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },

  coverageProvider: 'v8',
};
