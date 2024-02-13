const os = require('node:os');

const componentsConfig = require('./components/webpack.config');
const toolsConfig = require('./tools/webpack.config');


const devServerConfig = {
  devServer: {
    compress: true,
    port: process.env.PORT || 3003,
    allowedHosts: 'all',
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};

module.exports = [
  devServerConfig,
  componentsConfig,
  toolsConfig,
];


// Calculate how many parallel builds can be done. Minimum is 1, otherwise it's the amount of cores
// available, maxing at 4.
const cpuCount = os.cpus().length || 1;
const parallelBuildsNum = Math.min(cpuCount, 4);

module.exports.parallelism = parallelBuildsNum;
