module.exports = {
  preset: "ts-jest",
  testPathIgnorePatterns: [".d.ts", ".js"],
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  setupFilesAfterEnv: ["./tests/setup/setupTests.ts"],
};
