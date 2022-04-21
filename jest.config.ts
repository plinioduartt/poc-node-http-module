export default {
  bail: 1,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  setupFiles: ["<rootDir>/src/initializers/testsInitializer.ts"],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/?(*.)+(spec|test).[t]s?(x)"
  ]
};
