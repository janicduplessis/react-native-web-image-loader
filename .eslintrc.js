module.exports = {
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    'linebreak-style': ['error', 'unix'],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser', // Specifies the ESLint parser
      plugins: ['@typescript-eslint', 'prettier'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'plugin:prettier/recommended',
        'prettier/@typescript-eslint',
      ],
      rules: {
        'linebreak-style': ['error', 'unix'],
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/ban-ts-ignore': 'off',
      },
    },
    {
      files: ['**/__tests__/*.ts'],
      extends: ['plugin:jest/recommended'],
      env: {
        'jest/globals': true,
      },
    },
  ],
}
