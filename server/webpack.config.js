const path = require('path');
// const StartServerPlugin  = require('start-server-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './server/index.js',
  devtool: 'inline-source-map',
  mode: isProduction ? 'production' : 'development',
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    extensions: [ '.jsx', '.js' ]
  },
  output: {
    filename: 'server.js',
    path: path.resolve(process.cwd(), 'build'),
  },
  plugins: [
    // Should only be activated when webpack --watch is passed
    new NodemonPlugin({ watch: path.resolve('build') })
  ],
};
