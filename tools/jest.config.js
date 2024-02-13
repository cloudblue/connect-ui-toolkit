/** @type {import('jest').Config} */
module.exports = {
  rootDir: __dirname,
  displayName: 'tools',

  clearMocks: true,

  collectCoverageFrom: [
    '<rootDir>/**/*.js',
  ],

  testMatch: [
    '<rootDir>/(**/*\\.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx))',
  ],

  transform: {
    '^.+\\.js$': 'babel-jest',
  },

  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
