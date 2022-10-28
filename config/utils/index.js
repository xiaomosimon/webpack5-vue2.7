['logger', 'spinner'].forEach((key) => {
  const filename = `./${key}`;
  Object.assign(exports, filename);
});

exports.chalk = require('chalk');

exports.modifyConfig = (config, fn) => {
  if (Array.isArray(config)) {
    config.forEach((c) => fn(c));
  } else {
    fn(config);
  }
};
