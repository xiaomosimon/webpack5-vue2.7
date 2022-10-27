module.exports = {
  presets: ['@babel/preset-typescript'],
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
