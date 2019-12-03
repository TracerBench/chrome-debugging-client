module.exports = {
  root: true,
  env: {
    node: true,
    qunit: true,
    es2017: true,
  },
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  ignorePatterns: ["dist/"],
  extends: ["../.eslintrc"],
  rules: {
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-misused-promises": "off",
  },
};
