module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.specs.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
