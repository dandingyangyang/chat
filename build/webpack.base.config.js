const config = require('./config');
const isProduction = process.env.NODE_ENV === 'production';
const utils = require('./utils');
const vueLoaderConfig = require('./vue-loader.conf');
const path = require('path');

function resolve (dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    entry: ['./src/app.js'],
    output: {
        path: isProduction ? config.build.assetsRoot : config.dev.assetsRoot,
        filename: 'static/[name].js',
        // publicPath是html引用js的路径前缀，以及dev-server在内存中的根目录
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            vue: 'vue/dist/vue.common'
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg|cur)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    // 小于5kb的直接转成base64
                    limit: 5000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 5000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 5000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(sass|scss)$/,
                loader: 'style-loader!css-loader!sass-loader'
            }
        ]
    }
};
