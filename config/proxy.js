module.exports = (envConfig) => ({
  [envConfig.mainProxyTarget]: {
    target: envConfig.baseURL,
    pathRewrite: { [`^${envConfig.mainProxyTarget}`]: '' },
  },
});
