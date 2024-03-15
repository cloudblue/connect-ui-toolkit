/** @type {import('jest').Config} */
import url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
  rootDir: __dirname,

  collectCoverage: true,
  coverageDirectory: '<rootDir>/test/coverage/',
  coverageProvider: 'v8',

  projects: ['<rootDir>/components/jest.config.js', '<rootDir>/tools/jest.config.js'],
};
