module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  parser: 'vue-eslint-parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/recommended',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.tsx'],
      },
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
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
    semi: 2,
    'no-console': process.env.NODE_ENV === 'production' ? 1 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 1 : 0,
    'no-param-reassign': 0, // 重新分配参数值
  },
  globals: {
    webpackDefineEnvConfig: true, // 解决no-undef问题
  },
  // 禁用对应文件的规则
  overrides: [
    {
      files: ['./config/**', './scripts/*.js', './*.js'],
      rules: {
        'import/no-extraneous-dependencies': 0, // 依赖无关的包
        '@typescript-eslint/no-var-requires': 0, // 除 import 语句外，不允许使用 require 语句
        'global-require': 0,
        'no-nested-ternary': 0,
      },
    },
  ],
};
