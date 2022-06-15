const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config');


const HOST = '0.0.0.0';
const PORT = process.env.PORT || 3003;


const compiler = webpack({ ...webpackConfig, entry: webpackConfig.entry });

const devServerOptions = {
  ...webpackConfig.devServer,
  port: PORT,
  host: HOST,
};

const server = new WebpackDevServer(devServerOptions, compiler);

server.startCallback(() => {
  console.log(`Serving library (port ${PORT}):`);
});
