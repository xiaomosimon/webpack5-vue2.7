module.exports = () => {
  try {
    return require('os').cpus().length > 1;
  } catch (e) {
    return false;
  }
};
