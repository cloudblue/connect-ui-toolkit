/** @type {import('jest').Config} */
import url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
  rootDir: __dirname,
  displayName: 'tools',

  clearMocks: true,

  collectCoverageFrom: ['<rootDir>/**/*.js'],

  testMatch: ['<rootDir>/(**/*\\.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx))'],

  transform: {},

  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
    customExportConditions: ['node', 'node-addons'],
  },
};
