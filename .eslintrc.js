// eslint-config-airbnb-base eslint-plugin-import
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  parser: 'vue-eslint-parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:vue/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 'latest',
    ecmaFeatures: {
      impliedStrict: false,
      jsx: true,
    },
  },
  rules: {
    // 0 = off, 1 = warn, 2 = error
    'no-console': process.env.NODE_ENV === 'production' ? 1 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 1 : 0,
    '@typescript-eslint/no-var-requires': 0,
    semi: 2,
  },
  globals: {
    webpackDefineEnvConfig: true, // 解决no-undef问题
  },
};
