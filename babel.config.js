module.exports = {
  presets: [
    [
      '@vue/babel-preset-jsx', // 和@vue/babel-helper-vue-jsx-merge-props支持vue的jsx
      {
        compositionAPI: true,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3,
        helpers: true,
        regenerator: true,
      },
    ],
    [
      'import', // babel-plugin-import antd 按需引入
      {
        libraryName: 'ant-design-vue',
        libraryDirectory: 'es',
        style: 'css',
      },
    ],
  ],
};
