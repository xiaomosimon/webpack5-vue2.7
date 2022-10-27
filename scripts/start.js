'use strict';

process.env.NODE_ENV === 'development';
process.env.BABEL_ENV === 'development';

const envConfig = require('../config/env.js');
const {
  info,
  error,
  done,
  modifyConfig,
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

modifyConfig(webpackConfig, (config) => {
  config.devServer = { ...webpackDevServerConfig };
});

// compiler
const compiler = Webpack(webpackConfig);

// server
const server = new WebpackDevServer(webpackDevServerConfig, compiler);

let watchState = true;
// 使用内置webpack插件ProgressPlugin进行hooks监听
compiler.hooks.done.tap({ name: 'ProgressPlugin' }, (stats) => {
  if (!stats.hasErrors() && !stats.hasWarnings()) {
    const time = getCompileTime(stats);
    console.log('');
    done(`编译成功，用时${time}ms`);
    if (watchState) {
      console.log('');
      info(
        `程序运行在: ${webpackDevServerConfig.https ? 'https' : 'http'}://${
          webpackDevServerConfig.host
        }:${webpackDevServerConfig.port}`
      );
      watchState = false;
    }
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
  info(`启动${envConfig.RUN_ENV}环境开发服务器...\n`);
};

runServer().catch(() => {
  error(new Error('服务器启动失败并出现错误。'));
});
