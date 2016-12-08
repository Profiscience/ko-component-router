'use strict' // eslint-disable-line

const webpack = require('webpack')
const ESCompressPlugin = require('escompress-webpack-plugin')

module.exports = [
  makeConfig(),
  makeConfig({ minify: true }),
  makeConfig({ es2015: true }),
  makeConfig({ minify: true, es2015: true })
]

function makeConfig(o) {
  const minify = o ? o.minify : false
  const es2015 = o ? o.es2015 : false

  const entry = ['./src/index.js']
  const presets = ['es2017']
  const babelPlugins = ['transform-async-generator-functions']
  const webpackPlugins = []

  if (es2015) {
    babelPlugins.push('transform-es2015-modules-commonjs')
  } else {
    presets.unshift('es2015')
    entry.unshift('regenerator-runtime/runtime')
  }

  if (minify) {
    webpackPlugins.push(new webpack.optimize.DedupePlugin())
    webpackPlugins.push(es2015 ? new ESCompressPlugin() : new webpack.optimize.UglifyJsPlugin())
  }

  let filename = 'ko-component-router'
  if (es2015) {
    filename += '.es2015'
  }
  if (minify) {
    filename += '.min'
  }
  filename += '.js'

  return {
    entry,

    output: {
      path: 'dist',
      filename,
      library:  'ko-component-router',
      libraryTarget: 'umd'
    },

    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: 'babel',
          query: {
            cacheDirectory: true,
            presets,
            plugins: babelPlugins
          }
        }
      ]
    },

    externals: {
      knockout: {
        root: 'ko',
        commonjs: 'knockout',
        commonjs2: 'knockout',
        amd: 'knockout'
      }
    },

    plugins: webpackPlugins
  }
}
