module.exports = [
    {
      rules: {
        semi: "error",
        "no-unused-vars": "off",
        // "no-undef": "error",
        "prefer-const": "warn", 
        "array-callback-return":"error",
        // "no-console":"error",
        "curly": ["error", "all"],
        "no-unreachable":"error"
      },
      languageOptions: {
        ecmaVersion: 2023,
        sourceType: "script"
      },

    },
  ];
  