const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 */

module.exports = {
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "next/core-web-vitals",
    "prettier"
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    project,
    ecmaVersion: "latest",
    sourceType: "module",
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/", ".next/", "out/", "*.js"],
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "import/no-default-export": "off",
    "react/prop-types": "off",
  },
};