module.exports = {
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  ignorePatterns: ["dist/", ".eslintrc.js"],
  extends: ["../../.eslintrc"],
};
