'use strict';

exports.chalk = require('chalk');

Object.assign(exports, require(`./logger.js`));

exports.modifyConfig = (config, fn) => {
  if (Array.isArray(config)) {
    config.forEach((c) => fn(c));
  } else {
    fn(config);
  }
};
