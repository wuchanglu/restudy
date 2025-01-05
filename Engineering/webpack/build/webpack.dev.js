// webpack.dev.js
const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
// 合并公共配置,并添加开发环境配置
module.exports = merge(baseConfig, {
    mode: 'development', // 开发模式,打包更加快速,省了代码优化步骤
    devtool: "source-map", // 源码调试模式,后面会讲
    devServer: {
        port: 8787, // 服务端口号
        compress: false, // gzip压缩,开发环境不开启,提升热更新速度
        hot: true, // 开启热更新，后面会讲react模块热替换具体配置
        historyApiFallback: true, // 解决history路由404问题
        static: {
            directory: path.join(__dirname, "../public"), //托管静态资源public文件夹
        },
        proxy: [{
            context: ['/api'],
            target: 'http://localhost:3000',
            pathRewrite: { '^/old/api': '/new/api' }
        }], //中文文档的写法会报错，根据报错提示的网址配置
    },
})
