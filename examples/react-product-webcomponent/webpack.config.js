var path = require('path');
var webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const context = path.resolve(__dirname, './');
//'transform-react-jsx',
// [
//   'react-css-modules',
//   {
//     context
//   }
// ]
var webpackConfig = {
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'public')
    },
    module: {
        loaders: [
          {
            include: path.resolve(__dirname, './src'),
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
              presets:['react'],
              plugins: [
                
              ]
            },
            test: /\.js$/
          },
          {
            test: /\.css$/,
            loaders: [
              'style-loader',
              'css-loader',
            ],
          },
          {test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },    
        ],
      }
}

module.exports = webpackConfig;