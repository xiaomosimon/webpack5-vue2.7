'use strict';

module.exports = {
  '/api': {
    target: 'http://localhost:3000',
    pathRewrite: { '^/api': '' },
  },
  '/test': {
    target: 'http://localhost:3000',
    pathRewrite: { '^/test': '' },
  },
};
