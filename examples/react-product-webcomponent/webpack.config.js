var path = require('path');
var webpack = require('webpack')
var webpackConfig = {
    entry: './app.js',
    output: {
        filename: 'js/output.bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}

module.exports = webpackConfig;