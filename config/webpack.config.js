'use strict';

const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const paths = require('./paths.js');
const createEnvironmentHash = require('./webpack/createEnvironmentHash.js');
const getHasMultipleCores = require('./webpack/getHasMultipleCores.js');

module.exports = function (webpackEnv, envConfig) {
  const isEnvProduction = webpackEnv === 'production';
  const isEnvDevelopment = webpackEnv === 'development';
  const shouldUseSourceMap = envConfig.sourcemap;
  const hasMultipleCores = isEnvProduction && getHasMultipleCores();
  if (hasMultipleCores) {
    // 多线程
    const threadLoader = require('thread-loader');
    threadLoader.warmup(
      {
        workers: 2,
        workerParallelJobs: 50,
        poolTimeout: 2000,
        poolParallelJobs: 50,
      },
      ['babel-loader']
    );
  }
  return {
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    bail: isEnvProduction,
    // 持久化缓存
    cache: {
      type: 'filesystem',
      version: createEnvironmentHash(envConfig),
      cacheDirectory: paths.appWebpackCache,
      store: 'pack', // 编译器闲置放置缓存到文件夹
      buildDependencies: {
        defaultWebpack: ['webpack/lib/'],
        config: [__filename],
        tsconfig: [paths.appTsConfig],
      },
    },
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'eval-cheap-module-source-map',
    entry: paths.appEntry,
    module: {
      parser: {
        javascript: {
          exportsPresence: 'error',
          reexportExportsPresence: 'error',
        },
      },
      noParse: /^(vue|vue-router|pinia)$/, // 跳过文件编译 vue生态不需要二次编译
      rules: [
        {
          test: /\.vue$/,
          use: [
            {
              loader: 'vue-loader',
              options: {
                compilerOptions: {
                  preserveWhitespace: false, // 放弃标签间的空格
                },
              },
            },
          ],
        },
        /* 处理js */
        {
          test: /\.m?jsx?$/,
          // 确保 JS 的转译应用到 node_modules 的 Vue 单文件组件
          exclude: (file) =>
            /node_modules/.test(file) && !/\.vue\.js/.test(file),
          use: [
            hasMultipleCores && {
              loader: 'thread-loader', // 多线程
            },
            {
              loader: 'babel-loader',
              options: {
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
                // set it to false -- your project may benefit from this if it transpiles thousands of files.
                cacheCompression: false,
              },
            },
          ].filter(Boolean),
        },
        /* 处理ts */
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            hasMultipleCores && {
              loader: 'thread-loader', // 多线程
              options: {
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
                // set it to false -- your project may benefit from this if it transpiles thousands of files.
                cacheCompression: false,
              },
            },
            {
              loader: 'ts-loader',
              options: {
                // 设置为“仅编译”，关闭类型检查
                transpileOnly: true,
                happyPackMode: isEnvProduction, // 配合fork-ts-checker-webpack-plugin使用做多线程
                appendTsSuffixTo: ['\\.vue$'], // ts
              },
            },
          ].filter(Boolean),
        },
        /* 处理tsx */
        // {
        //   test: /\.tsx$/,
        //   exclude: /node_modules/,
        //   use: [
        //     hasMultipleCores && {
        //       loader: 'thread-loader', // 多线程
        //       options: {
        //         // This is a feature of `babel-loader` for webpack (not Babel itself).
        //         // It enables caching results in ./node_modules/.cache/babel-loader/
        //         // directory for faster rebuilds.
        //         cacheDirectory: true,
        //         // set it to false -- your project may benefit from this if it transpiles thousands of files.
        //         cacheCompression: false,
        //       },
        //     },
        //     {
        //       loader: 'ts-loader',
        //       options: {
        //         transpileOnly: true,
        //         happyPackMode: isEnvProduction, // 配合fork-ts-checker-webpack-plugin使用做多线程
        //         appendTsxSuffixTo: ['\\.vue$'], // tsx
        //       },
        //     },
        //   ].filter(Boolean),
        // },
        /* 处理css */
        {
          test: /\.css$/,
          use: [
            isEnvProduction
              ? {
                  loader: MiniCssExtractPlugin.loader,
                }
              : {
                  loader: 'style-loader',
                },
            {
              loader: 'css-loader',
              options: {
                sourceMap: isEnvProduction && shouldUseSourceMap,
                importLoaders: 2,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: isEnvProduction && shouldUseSourceMap,
              },
            },
          ],
        },
        /* 处理scss */
        {
          test: /\.scss$/,
          use: [
            isEnvProduction
              ? {
                  loader: MiniCssExtractPlugin.loader,
                }
              : {
                  loader: 'style-loader',
                },
            {
              loader: 'css-loader',
              options: {
                sourceMap: isEnvProduction && shouldUseSourceMap,
                importLoaders: 2,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: isEnvProduction && shouldUseSourceMap,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isEnvProduction && shouldUseSourceMap,
              },
            },
          ],
        },
        /* 处理sass */
        {
          test: /\.sass$/,
          use: [
            isEnvProduction
              ? {
                  loader: MiniCssExtractPlugin.loader,
                }
              : {
                  loader: 'style-loader',
                },
            {
              loader: 'css-loader',
              options: {
                sourceMap: isEnvProduction && shouldUseSourceMap,
                importLoaders: 2,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: isEnvProduction && shouldUseSourceMap,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isEnvProduction && shouldUseSourceMap,
                sassOptions: {
                  indentedSyntax: true,
                },
              },
            },
          ],
        },
        /* 内置loader处理其他文件 */
        /* 处理svg */
        {
          test: /\.(svg)(\?.*)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'img/[name].[hash:8][ext]',
          },
        },
        /* 处理img */
        {
          test: /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/,
          type: 'asset',
          generator: {
            filename: 'img/[name].[hash:8][ext]',
          },
          parser: {
            dataUrlCondition: {
              maxSize: 1024, // 1kb
            },
          },
        },
        /* 处理media */
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          type: 'asset',
          generator: {
            filename: 'media/[name].[hash:8][ext]',
          },
        },
        /* 处理font */
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
          type: 'asset',
          generator: {
            filename: 'fonts/[name].[hash:8][ext]',
          },
        },
      ],
    },
    output: {
      path: paths.appBuild,
      filename: isEnvProduction
        ? 'js/[name].[contenthash:8].js'
        : 'js/[name].js',
      chunkFilename: isEnvProduction
        ? 'js/[name].[contenthash:8].js'
        : 'js/[name].js',
      clean: isEnvProduction && {
        keep(asset) {
          return asset.includes('public');
        },
      },
    },
    optimization: {
      realContentHash: false, // 不进行额外的哈希编译
      runtimeChunk: isEnvProduction && { name: 'runtime' }, // 抽离runtime chunk
      // 分包
      splitChunks: {
        cacheGroups: {
          defaultVendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial',
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true,
          },
        },
      },
      minimize: isEnvProduction,
      minimizer: [
        // 并行压缩
        new TerserPlugin({
          terserOptions: {
            compress: {
              // https://github.com/terser/terser#compress-options
              arrows: false,
              collapse_vars: false,
              comparisons: false,
              computed_props: false,
              hoist_funs: false,
              hoist_props: false,
              hoist_vars: false,
              inline: false,
              loops: false,
              negate_iife: false,
              properties: false,
              reduce_funcs: false,
              reduce_vars: false,
              switches: false,
              toplevel: false,
              typeofs: false,
              booleans: true,
              if_return: true,
              sequences: true,
              unused: true,
              conditionals: true,
              dead_code: true,
              evaluate: true,
              pure_funcs: ['console.log', 'console.info'],
              drop_debugger: true,
            },
            mangle: {
              safari10: true,
            },
          },
          parallel: hasMultipleCores,
          extractComments: false, // 不将代码中的备注抽取为单独文件
        }),
        // 压缩css
        isEnvProduction &&
          new CssMinimizerPlugin({
            parallel: hasMultipleCores, // 使用多进程并发
            minimizerOptions: {
              preset: [
                'default',
                {
                  mergeLonghand: false,
                  cssDeclarationSorter: false,
                },
              ],
            },
          }),
      ].filter(Boolean),
    },
    plugins: [
      // 定义全局变量
      new webpack.DefinePlugin({
        webpackDefineEnvConfig: JSON.stringify(envConfig),
      }),
      // vue文件解析
      new VueLoaderPlugin(),
      // html
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            title: '测试项目',
            inject: true,
            scriptLoading: 'defer',
            template: paths.appHtml,
          },
          isEnvProduction
            ? {
                minify: {
                  // 使用html-minifier-terser
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined
        )
      ),
      // 压缩css
      isEnvProduction &&
        new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash:8].css',
          chunkFilename: 'css/[name].[contenthash:8].css',
        }),
      // 复制文件
      isEnvProduction &&
        new CopyPlugin({
          patterns: [
            {
              from: paths.appPublic,
              to: paths.appBuild,
              toType: 'dir',
              noErrorOnMissing: true,
              globOptions: {
                ignore: ['**/.DS_Store', paths.appHtml],
              },
              info: {
                minimized: true,
              },
            },
          ],
        }),
      // ts检测 将类型检查能力剥离到 子进程 执行
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          extensions: {
            vue: {
              enabled: true,
              compiler: 'vue-template-compiler',
            },
          },
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
        },
      }),
      // eslint 校验
      new ESLintPlugin({
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue'],
        cwd: paths.appPath,
        context: paths.appPath,
        // 缓存
        cache: true,
        cacheLocation: path.resolve(
          paths.appNodeModules,
          '.cache/.eslintcache'
        ),
        failOnWarning: true,
        failOnError: true,
      }),
      // 纠正大小写路径
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': paths.appSrc,
        vue$: 'vue/dist/vue.runtime.esm.js',
      },
      extensions: ['.ts', '.tsx', '.vue', '.js', '.jsx'],
      modules: ['node_modules', paths.appNodeModules],
    },
    stats: 'errors-only',
  };
};
