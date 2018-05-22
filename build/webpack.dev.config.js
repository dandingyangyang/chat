const base = require('./webpack.base.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const merge = require('webpack-merge');
const config = require('./config');
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');

module.exports = merge(base, {
    mode: 'development',
    devtool: config.dev.devtool,
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        }),
        new VueLoaderPlugin(),
        // 热部署
        new webpack.HotModuleReplacementPlugin(),
        // 删除上一次打包输出内容
        new WebpackCleanupPlugin()
    ],
    devServer: {
        // 静态资源地址
        // contentBase: path.join(__dirname, '..', 'dist'),
        contentBase: false,
        hot: true,
        host: config.dev.host,
        port: config.dev.port
        // 打包出来的文件所在的内存根目录
        // publicPath: '/',
        // historyApiFallback: {
        //     rewrites: [
        //         {
        //             from: '/',
        //             to: '/static/index.html'
        //         }
        //     ]
        // }
    }
});
