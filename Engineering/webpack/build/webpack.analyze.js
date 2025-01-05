const SpeedMeasurePlugin = require('speed-measure-webpack-plugin'); // 引入webpack打包速度分析插件
const smp = new SpeedMeasurePlugin(); // 实例化分析插件
const { merge } = require('webpack-merge')
const WebpackBaseConfig = require('./webpack.base')
const config = merge(WebpackBaseConfig, {
  mode: "production",
});
module.exports = smp.wrap(config);