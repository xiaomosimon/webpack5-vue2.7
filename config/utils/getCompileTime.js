function isMultiStats(stats) {
  return stats.stats;
}

module.exports = function getCompileTime(stats) {
  if (isMultiStats(stats)) {
    // Webpack multi compilations run in parallel so using the longest duration.
    // https://webpack.github.io/docs/configuration.html#multiple-configurations
    return stats.stats
      .reduce((time, childStats) => Math.max(time, getCompileTime(childStats)), 0);
  }
  return stats.endTime - stats.startTime;
};