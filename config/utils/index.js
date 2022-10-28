['logger', 'spinner'].forEach((key) => {
  Object.assign(exports, require(`./${key}`));
});

exports.chalk = require('chalk');

exports.modifyConfig = (config, fn) => {
  if (Array.isArray(config)) {
    config.forEach((c) => fn(c));
  } else {
    fn(config);
  }
};