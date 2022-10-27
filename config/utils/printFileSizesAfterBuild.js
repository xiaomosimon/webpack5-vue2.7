'use strict';

module.exports = (stats, appBuild) => {
  const fs = require('fs');
  const path = require('path');
  const zlib = require('zlib'); // 用于 node.buffer 缓冲
  const ui = require('cliui')({ width: process.stdout.columns || 80 }); // 创建复杂的多列命令行界面
  const chalk = require('chalk');

  const json = stats.toJson({
    hash: false,
    modules: false,
    chunks: false,
  });

  let assets = json.assets
    ? json.assets
    : json.children.reduce((acc, child) => acc.concat(child.assets), []);

  const seenNames = new Map();
  const isJS = (val) => /\.js$/.test(val);
  const isCSS = (val) => /\.css$/.test(val);
  const isMinJS = (val) => /\.min\.js$/.test(val);
  assets = assets
    .map((a) => {
      a.name = a.name.split('?')[0];
      return a;
    })
    .filter((a) => {
      if (seenNames.has(a.name)) {
        return false;
      }
      seenNames.set(a.name, true);
      return isJS(a.name) || isCSS(a.name);
    })
    .sort((a, b) => {
      if (isJS(a.name) && isCSS(b.name)) return -1;
      if (isCSS(a.name) && isJS(b.name)) return 1;
      if (isMinJS(a.name) && !isMinJS(b.name)) return -1;
      if (!isMinJS(a.name) && isMinJS(b.name)) return 1;
      return b.size - a.size;
    });

  function formatSize(size) {
    return (size / 1024).toFixed(2) + ' KiB';
  }

  function getCompressedSize(asset) {
    const filepath = path.join(appBuild, asset.name);
    const buffer = fs.readFileSync(filepath);
    return formatSize(zlib.gzipSync(buffer).length);
  }

  function makeRow(a, b, c) {
    return `  ${a}\t    ${b}\t ${c}`;
  }

  ui.div(
    makeRow(
      chalk.cyan.bold(`文件`),
      chalk.cyan.bold(`源大小`),
      chalk.cyan.bold(`压缩后`)
    ) +
      `\n\n` +
      assets
        .map((asset) =>
          makeRow(
            /js$/.test(asset.name)
              ? chalk.green(asset.name)
              : chalk.blue(asset.name),
            formatSize(asset.size),
            getCompressedSize(asset)
          )
        )
        .join(`\n`)
  );

  const time = stats.endTime - stats.startTime;
  const now = new Date().toISOString();
  const hash = stats.hash;
  const info = `结束时间: ${chalk.white(now)}
  构建目录: ${chalk.white(appBuild)}
  项目哈希: ${chalk.white(hash)}
  构建时间: ${chalk.white(time)}ms`;

  return `${ui.toString()}\n
  ${chalk.gray(`提示：省略了图像和其他类型的静态文件展示。`)}
  ${info}\n`;
};
