export default {
  moduleFileExtensions: ["js", "json", "ts"],
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
};
