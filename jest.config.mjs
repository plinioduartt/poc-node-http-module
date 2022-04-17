export default {
  bail: 1,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  setupFiles: ["<rootDir>/src/initializers/testsInitializer.mjs"],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/?(*.)+(spec|test).[mjs]?(x)"
  ]
};
