module.exports = {
    setupFilesAfterEnv: ['./src/setupTests.js'],
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    testPathIgnorePatterns: ['/node_modules/', '/build/'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  };
  