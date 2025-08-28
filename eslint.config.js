module.exports = [
  {
    files: ["**/*.js"], // all JS files
    languageOptions: {
      ecmaVersion: 2020, // modern JS
      sourceType: "module", // allow import/export if used
    },
    rules: {
      "no-unused-vars": ["warn"],
      "no-console": "off",
      eqeqeq: ["error", "always"],
    },
  },
];
