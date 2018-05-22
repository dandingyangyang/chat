const base = require('./webpack.base.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const merge = require('webpack-merge');
const config = require('./config');
const { VueLoaderPlugin } = require('vue-loader');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const utils = require('./utils');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(base, {
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js')
    },
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true,
            usePostCSS: true
        })
    },
    mode: 'production',
    devtool: false,
    optimization: {
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/](node_modules|plugins)[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        }),
        new VueLoaderPlugin(),
        // 删除上一次打包输出内容
        new WebpackCleanupPlugin(),
        // new UglifyJsPlugin(),
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[hash].css'),
            allChunks: true
        }),
        new OptimizeCSSPlugin({
            safe: true,
            map: {
                inline: true
            }
        })
    ]
});
