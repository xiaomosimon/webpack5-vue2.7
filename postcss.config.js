module.exports = {
  plugins: [
    [
      require('postcss-import'), // 构建时导入
      require('postcss-preset-env'), // 预设包含了autoprefixer
      {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
      },
    ],
  ],
};
