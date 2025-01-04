const { merge } = require('webpack-merge')
const WebpackBaseConfig = require('./webpack.base')
const config = merge(WebpackBaseConfig, {
  mode: "production",
});
module.exports = config;