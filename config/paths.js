const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

module.exports = {
  appPath: resolveApp('.'),
  appBuild: resolveApp('dist'),
  appPublic: resolveApp('public'),
  appSrc: resolveApp('src'),
  appEntry: resolveApp('src/main.ts'),
  appHtml: resolveApp('public/index.html'),
  appPackageJson: resolveApp('package.json'),
  appTsConfig: resolveApp('tsconfig.json'),
  pnpmLockFile: resolveApp('pnpm-lock.yaml'),
  appNodeModules: resolveApp('node_modules'),
  appWebpackCache: resolveApp('node_modules/.cache'),
};
