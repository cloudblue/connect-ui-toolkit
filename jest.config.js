/** @type {import('jest').Config} */
module.exports = {
  rootDir: __dirname,

  collectCoverage: true,
  coverageDirectory: '<rootDir>/test/coverage/',
  coverageProvider: 'v8',

  projects: ['<rootDir>/components/jest.config.js', '<rootDir>/tools/jest.config.js'],
};
