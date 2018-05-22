const path = require('path');
module.exports = {
    dev: {
        assetsRoot: path.resolve(__dirname, '../dist/'),
        assetsPublicPath: '/',
        assetsSubDirectory: '',
        cssSourceMap: true,

        host: '0.0.0.0',
        port: 8111,

        devtool: 'cheap-module-eval-source-map'
    },
    build: {
        assetsRoot: path.resolve(__dirname, '../output/'),
        assetsPublicPath: 'https://s3.pstatp.com/toutiao/ex_student/',
        assetsSubDirectory: '',
        productionSourceMap: false
    }
};
