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
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: [
          path.resolve('node_modules')
        ],
        options: {
          configFileName: path.resolve(__dirname, '../tsconfig.json'),
          useBabel: true,
          useCache: true,
          cacheDirectory: path.resolve(__dirname, '.cache'),
          module: 'es2015'
        }
      },
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
  },
  resolve: {
    alias: {
      'ko-component-router': path.resolve(__dirname, '../src')
    },
    extensions: [
      '.js',
      '.ts'
    ]
  }
}
