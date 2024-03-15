import configs, { parallelism } from './webpack.config.js';

const devServerConfig = {
  devServer: {
    compress: true,
    port: process.env.PORT || 3003,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    static: false,
    client: {
      overlay: false,
    },
  },
};

export default [devServerConfig, ...configs];

export { parallelism };
