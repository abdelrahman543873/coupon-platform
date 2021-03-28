module.exports = {
  moduleFileExtensions: ["js"],
  moduleDirectories: ["node_modules", "src"],
  rootDir: "./",
  testRegex: ".spec.js$",
  transformIgnorePatterns: ["/node_modules/"],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  collectCoverage: false,
  verbose: false,
  setupFilesAfterEnv: ["<rootDir>/test/before-test-run.js"],
  displayName: {
    name: "coupons",
    color: "blue",
  },
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
};
