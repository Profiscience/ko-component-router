'use strict' // eslint-disable-line strict

const path = require('path')

module.exports = {
  entry: {
    hashbang: path.resolve(__dirname, './hashbang/index.js')
  },
  output: {
    publicPath: '/dist/',
    filename: '[name].js'
  },
  devServer: {
    contentBase: __dirname,
    hot: true
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          path.resolve('node_modules')
        ],
        query: {
          cacheDirectory: true,
          plugins: [
            'transform-es2015-modules-commonjs'
          ],
          presets: [
            'es2017'
          ]
        }
      }
    ]
  }
}
