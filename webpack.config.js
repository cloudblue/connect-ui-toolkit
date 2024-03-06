const os = require('node:os');

const componentsConfig = require('./components/webpack.config');
const toolsConfig = require('./tools/webpack.config');

module.exports = [componentsConfig, toolsConfig];

// Calculate how many parallel builds can be done. Minimum is 1, otherwise it's the amount of cores
// available, maxing at 4.
const cpuCount = os.cpus().length || 1;
const parallelBuildsNum = Math.min(cpuCount, 4);

module.exports.parallelism = parallelBuildsNum;
