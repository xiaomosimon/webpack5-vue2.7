module.exports = {
  presets: [
    [
      '@vue/babel-preset-jsx',
      {
        compositionAPI: true,
      },
    ], // 和@vue/babel-helper-vue-jsx-merge-props支持vue的jsx
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
  ],
};
