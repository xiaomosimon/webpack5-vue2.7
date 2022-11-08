module.exports = (RUN_ENV, NODE_ENV) => {
  // dev 默认配置
  let config = {
    timeout: 50000,
    baseURL: 'http://dev.simon.com',
  };

  if (NODE_ENV === 'development') {
    // dev mode , proxy target
    config = {
      ...config,
      mainProxyTarget: '/mainProxyTarget',
    };
  }

  switch (RUN_ENV) {
    case 'local':
      config = {
        ...config,
        baseURL: 'http://local.simon.com',
      };
      break;
    case 'qa':
      config = {
        ...config,
        baseURL: 'http://qa.simon.com',
      };
      break;
    case 'preview':
      config = {
        ...config,
        baseURL: 'http://preview.simon.com',
      };
      break;
    case 'prod':
      config = {
        ...config,
        baseURL: 'http://prod.simon.com',
      };
      break;
    default:
      break;
  }

  return config;
};
