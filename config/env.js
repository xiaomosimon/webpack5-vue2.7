// 获取命令行传参
const parseArgv = require('minimist')(process.argv.slice(2));

const generateRequestConfig = require('./request'); 

// 解析运行时环境
const buildEnvEnum = ['dev', 'local', 'qa', 'preview', 'prod'];
const automatedDeploymentConfigArray = parseArgv._;
let RUN_ENV =
  automatedDeploymentConfigArray[automatedDeploymentConfigArray.length - 1];
if (!buildEnvEnum.includes(RUN_ENV)) {
  RUN_ENV = 'dev';
}
// 解析部署参数
const automatedDeploymentConfig = automatedDeploymentConfigArray
  .slice(0, -2)
  .reduce((source, item) => {
    source[item] = true;
    return source;
  }, {});

// 删除运行时环境
delete parseArgv._;


const NODE_ENV = process.env.NODE_ENV || 'development';

// 解析命令行参数
module.exports = Object.keys(parseArgv).reduce(
  (envConfig, key) => {
    envConfig[key] = parseArgv[key] === 'false' ? false : parseArgv[key];
    return envConfig;
  },
  {
    ...automatedDeploymentConfig,
    NODE_ENV,
    RUN_ENV,
    sourcemap: false,
    ...generateRequestConfig(RUN_ENV, NODE_ENV),
  }
);
