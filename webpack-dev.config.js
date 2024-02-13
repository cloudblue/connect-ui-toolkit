const configs = require('./webpack.config');
const { parallelism } = require('./webpack.config');


const devServerConfig = {
  devServer: {
    compress: true,
    port: process.env.PORT || 3003,
    allowedHosts: 'all',
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    static: false,
  },
};

module.exports = [
  devServerConfig,
  ...configs,
];


module.exports.parallelism = parallelism;
