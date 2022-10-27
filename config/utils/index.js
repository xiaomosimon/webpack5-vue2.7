'use strict';

['logger', 'spinner'].filter((key) => {
  Object.assign(exports, require(`./${key}.js`));
});

exports.chalk = require('chalk');

exports.modifyConfig = (config, fn) => {
  if (Array.isArray(config)) {
    config.forEach((c) => fn(c));
  } else {
    fn(config);
  }
};
