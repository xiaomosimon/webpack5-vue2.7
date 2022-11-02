module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  parser: 'vue-eslint-parser', // 替代了@typescript-eslint/parser
  plugins: [
    '@typescript-eslint',
    'import', // 添加eslint-plugin-import对typeScript支持 eslint-import-resolver-typescript
  ],
  extends: [
    'airbnb-base', // eslint-config-airbnb-base + eslint-plugin-import
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/recommended',
    'prettier',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    // eslint-import-resolver-typescript
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 'latest',
    ecmaFeatures: {
      impliedStrict: false,
      jsx: false,
    },
    // vue-eslint-parser
    vueFeatures: {
      filter: false,
      interpolationAsNonHTML: true,
      styleCSSVariableInjection: true,
    },
  },
  rules: {
    // 0 = off, 1 = warn, 2 = error
    semi: 2,
    'no-console': process.env.NODE_ENV === 'production' ? 1 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 1 : 0,
    'no-param-reassign': 0, // 重新分配参数值
    'import/extensions': [
      0,
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
    // 'import/no-unresolved': 1, // eslint-import-resolver-typescript
  },
  globals: {
    webpackDefineEnvConfig: true, // 解决no-undef问题
  },
  // 禁用对应文件的规则
  overrides: [
    {
      files: ['./config/**', './scripts/*.js', './*.js'],
      rules: {
        //  eslint-plugin-import
        'import/no-extraneous-dependencies': 0, // 依赖无关的包
        'import/no-dynamic-require': 0, // 禁止使用表达式调用 require()
        // typescript
        '@typescript-eslint/no-var-requires': 0, // 除 import 语句外，不允许使用 require 语句
        // other
        'global-require': 0,
        'no-nested-ternary': 0,
      },
    },
    /**
     * 因为ts已经对‘no-undef’支持的很好，不需要再用eslint。
     * 规避声明文件类型和接口使用
     */
    {
      files: ['*.ts', '*.tsx', '*.vue'],
      rules: {
        "no-shadow": 0,
        'no-undef': 0,
      },
    },
  ],
};
