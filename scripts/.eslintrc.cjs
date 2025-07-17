module.exports = {
  root: true,
  env: {
    node: true,
    es2017: true,
  },
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  ignorePatterns: ["dist/", ".eslintrc.js"],
  extends: ["../.eslintrc"],
  rules: {
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
  },
};
