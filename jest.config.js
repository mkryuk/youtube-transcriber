module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  roots: ['<rootDir>/src'], // Specify where the test files are located
  testRegex: '.*\\.test\\.ts$', // Test files should have `.test.ts` suffix
};
