'use strict' // eslint-disable-line strict

const path = require('path')

module.exports = {
  entry: {
    'hashbang': path.resolve(__dirname, './hashbang/index.js'),
    'lazy-loading': path.resolve(__dirname, './lazy-loading/index.js'),
    'loading-animation': path.resolve(__dirname, './loading-animation/index.js'),
    'mvc': path.resolve(__dirname, './mvc/index.js'),
    'path-binding': path.resolve(__dirname, './path-binding/index.js'),
    'simple-auth': path.resolve(__dirname, './simple-auth/index.js')
  },
  output: {
    publicPath: '/dist/',
    filename: '[name].js'
  },
  devServer: {
    contentBase: __dirname
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          path.resolve('node_modules')
        ],
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  }
}
