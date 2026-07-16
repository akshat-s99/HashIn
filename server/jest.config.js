export default {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  transform: {},
  moduleFileExtensions: ['js', 'json'],
  setupFilesAfterEnv: ['./tests/setup.js'],
  testTimeout: 30000,
  // Force serial execution to avoid DB conflicts
  maxWorkers: 1,
};
