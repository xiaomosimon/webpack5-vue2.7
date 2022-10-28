const ANALYZER_PORT = 7676;
const SCRIPTS_ENV = 'production';
// const SCRIPTS_ENV = 'development';
process.env.NODE_ENV = SCRIPTS_ENV;
process.env.BABEL_ENV = SCRIPTS_ENV;

const Webpack = require('webpack');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');
const envConfig = require('../config/env');
const {
  error,
  log,
  done,
  chalk,
  modifyConfig,
  logWithSpinner,
  stopSpinner,
  changeSpinner,
} = require('../config/utils');
const formatWebpackMessages = require('../config/utils/formatWebpackMessages');
const printFileSizesAfterBuild = require('../config/utils/printFileSizesAfterBuild');

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

const { watch } = envConfig;

// 构建保持监听状态
if (watch) {
  modifyConfig(webpackConfig, (config) => {
    config.watch = true;
    config.watchOptions = {
      ignored: /node_modules/,
    };
  });
}

// 构建进度
modifyConfig(webpackConfig, (config) => {
  config.plugins.push(
    new Webpack.ProgressPlugin((percentage, message, ...args) => {
      changeSpinner({
        text: `构建进度：${Math.round(
          percentage * 100
        )}% ${message} ${args.join(' ')}`,
      });
    })
  );
});

logWithSpinner(`正在启动生成优化后的${envConfig.RUN_ENV}环境的项目包...\n`);

// 运行webpack处理
new Promise((resolve, reject) => {
  function compilerCallback(err, stats) {
    stopSpinner(false);
    let messages;
    if (err) {
      // 错误处理
      if (!err.message) {
        return reject(err);
      }

      let errMessage = err.message;

      // Add additional information for postcss errors
      if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
        errMessage += `\nCompileError: Begins at CSS selector ${err.postcssNode.selector}`;
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
          `使用eslint忽略检测将 ${chalk.cyan(
            '// eslint-disable-next-line'
          )} 添加到前一行。\n`
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
      if (!watch) {
        process.exit(0);
      }
    },
    (err) => {
      error(new Error('构建失败并出现错误。'));
      if (err) {
        error(err.message ? err.message : err);
      }
      if (!watch) {
        process.exit(1);
      }
    }
  )
  .catch((err) => {
    error(new Error('构建失败并出现错误。'));
    if (err && err.message) {
      console.log(err.message);
    }
    if (!watch) {
      process.exit(1);
    }
  });
