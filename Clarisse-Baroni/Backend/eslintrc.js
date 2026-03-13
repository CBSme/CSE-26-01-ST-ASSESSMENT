module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'commonjs',
  },
  rules: {
    // Possible errors
    'no-console': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    // Best practices
    'eqeqeq': ['error', 'always'],
    'no-var': 'error',
    'prefer-const': 'error',
    'curly': ['error', 'all'],

    // Style (Prettier handles most formatting,
    // these are logic-level style rules)
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-trailing-spaces': 'error',
  },
};
