module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__/test_cases'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testTimeout: 90000,
};
