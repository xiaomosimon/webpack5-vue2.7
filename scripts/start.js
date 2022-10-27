'use strict';

process.env.NODE_ENV === 'development';
process.env.BABEL_ENV === 'development';

const envConfig = require('../config/env.js');
const {
  error,
  done,
  modifyConfig,
  logWithSpinner,
  stopSpinner,
  pauseSpinner,
  changeSpinner,
  resumeSpinner,
} = require('../config/utils');
const getCompileTime = require('../config/utils/getCompileTime.js');
const clearConsole = require('../config/utils/clearConsole.js');

// webpack
const Webpack = require('webpack');
// webpack-dev-server
const WebpackDevServer = require('webpack-dev-server');
// config
const configFactory = require('../config/webpack.config.js');
const webpackConfig = configFactory('development', envConfig);
const proxyConfig = require('../config/proxy.js');
const webpackDevServerConfig = require('../config/webpackDevServer.config.js')(
  proxyConfig,
  envConfig
);

// 添加server配置
modifyConfig(webpackConfig, (config) => {
  config.devServer = { ...webpackDevServerConfig };
});

logWithSpinner(`启动${envConfig.RUN_ENV}环境开发服务器...\n`);

// compiler
const compiler = Webpack(webpackConfig);

// server
const server = new WebpackDevServer(webpackDevServerConfig, compiler);

let watchState = true;
// 使用内置webpack插件ProgressPlugin进行hooks监听
compiler.hooks.compilation.tap({ name: 'ProgressPlugin' }, () => {
  if (watchState) {
    changeSpinner({
      text: '项目编译中...\n',
    });
  } else {
    resumeSpinner();
  }
});
compiler.hooks.done.tap({ name: 'ProgressPlugin' }, (stats) => {
  if (!stats.hasErrors() && !stats.hasWarnings()) {
    if (watchState) {
      pauseSpinner();
      clearConsole();
      watchState = false;
    } else {
      pauseSpinner();
    }

    const time = getCompileTime(stats);
    done(
      `项目编译成功，用时${time}ms，程序运行在: ${
        webpackDevServerConfig.https ? 'https' : 'http'
      }://${webpackDevServerConfig.host}:${webpackDevServerConfig.port}`
    );
  } else {
    pauseSpinner();
  }
});

['SIGINT', 'SIGTERM'].forEach((sig) => {
  process.on(sig, () => {
    server.close();
    process.exit();
  });
});

const runServer = async () => {
  await server.start();
  clearConsole();
};

runServer().catch(() => {
  stopSpinner();
  error(new Error('服务器启动失败并出现错误。'));
});
