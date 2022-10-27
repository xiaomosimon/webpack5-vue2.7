'use strict';

const ANALYZER_PORT = 7676;
const SCRIPTS_ENV = 'production';
// const SCRIPTS_ENV = 'development';
process.env.NODE_ENV === SCRIPTS_ENV;
process.env.BABEL_ENV === SCRIPTS_ENV;

const Webpack = require('webpack');
const paths = require('../config/paths.js');
const configFactory = require('../config/webpack.config.js');
const envConfig = require('../config/env.js');
const {
  error,
  log,
  done,
  info,
  chalk,
  modifyConfig,
} = require('../config/utils');
const formatWebpackMessages = require('../config/utils/formatWebpackMessages.js');
const printFileSizesAfterBuild = require('../config/utils/printFileSizesAfterBuild.js');

const webpackConfig = configFactory(SCRIPTS_ENV, envConfig);

// 代码分析
if (envConfig.report) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  modifyConfig(webpackConfig, (config) => {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerPort: ANALYZER_PORT,
      })
    );
  });
}

const watch = envConfig.watch;
if (watch) {
  modifyConfig(webpackConfig, (config) => {
    config.watch = true;
    config.watchOptions = {
      ignored: /node_modules/,
    };
  });
}
new Promise((resolve, reject) => {
  function compilerCallback(err, stats) {
    info(chalk.green(`正在生成优化后的${envConfig.RUN_ENV}环境的项目包...\n`));
    let messages;
    if (err) {
      // 错误处理
      if (!err.message) {
        return reject(err);
      }

      let errMessage = err.message;

      // Add additional information for postcss errors
      if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
        errMessage +=
          '\nCompileError: Begins at CSS selector ' +
          err['postcssNode'].selector;
      }
      messages = formatWebpackMessages({
        errors: [errMessage],
        warnings: [],
      });
    } else {
      // stats错误处理
      messages = formatWebpackMessages(
        stats.toJson({ all: false, warnings: true, errors: true })
      );
    }
    if (messages.errors.length) {
      // Only keep the first error. Others are often indicative
      // of the same problem, but confuse the reader with noise.
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }
      return reject(new Error(messages.errors.join('\n\n')));
    }

    return resolve({ stats, warnings: messages.warnings });
  }
  // 执行webpack
  if (watch) {
    Webpack(webpackConfig, compilerCallback);
  } else {
    Webpack(webpackConfig).run(compilerCallback);
  }
})
  .then(
    ({ stats, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('编译时存在警告。\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          '使用eslint忽略检测将 ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' 添加到前一行。\n'
        );
      } else {
        // 打包成功后的stats处理
        log(printFileSizesAfterBuild(stats, paths.appBuild));
        // 打包完成后其他处理
        if (envConfig.report) {
          done(
            `构建完成，性能分析程序运行在: http://localhost:${ANALYZER_PORT}`
          );
        } else {
          done(
            `构建完成，项目目录: ${chalk.cyan(paths.appBuild)} , 可进行部署。`
          );
        }
      }
      !watch && process.exit(0);
    },
    (err) => {
      error(new Error('构建失败并出现错误。'));
      if (err) {
        err.message ? error(err.message) : error(err);
      }
      !watch && process.exit(1);
    }
  )
  .catch((err) => {
    error(new Error('构建失败并出现错误。'));
    if (err && err.message) {
      console.log(err.message);
    }
    !watch && process.exit(1);
  });
