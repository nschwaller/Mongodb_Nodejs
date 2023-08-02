module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    testMatch: ['**/__tests__/**/*.test.ts'],
  };
  