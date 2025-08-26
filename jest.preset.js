const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/tmp/'
  ],
  coverageReporters: ['html', 'text', 'lcov'],
  collectCoverage: true,

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '.*\\.entity\\.ts$',
    '.*\\.dto\\.ts$',
    '.*\\.interface\\.ts$',
    '.*\\.module\\.ts$',
    'index\\.ts$',
    'main\\.ts$',
  ],
};
