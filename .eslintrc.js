module.exports = {
  env: {
    browser: true,
    es2021: true,
  },

  extends: ["eslint:recommended", "prettier", "prettier/react"],

  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {},
};
