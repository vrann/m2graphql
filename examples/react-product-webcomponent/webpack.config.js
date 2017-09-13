var path = require('path');
var webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpackConfig = {
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'public')
    },
    module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query:
            {
              presets:['react']
            }
          },
          {test: /\.css$/, loader: 'css-loader'},
          {test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },    
        ],
      }
}

module.exports = webpackConfig;