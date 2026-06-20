/**
 * @fileoverview Jest configuration for CarbonWise test suite.
 * Enforces minimum coverage thresholds to prevent regressions.
 */

'use strict';

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  verbose: true,
  collectCoverageFrom: [
    'utils.js',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
  testPathIgnorePatterns: ['/node_modules/'],
};
