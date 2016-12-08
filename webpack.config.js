'use strict' // eslint-disable-line

const webpack = require('webpack')

module.exports = [
  makeConfig(),
  makeConfig({ minify: true })
]

function makeConfig(o) {
  const minify = o ? o.minify : false
  return {
    entry: ['regenerator-runtime/runtime', './src/index.js'],

    output: {
      path: 'dist',
      filename: minify ? 'ko-component-router.min.js' : 'ko-component-router.js',
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
            cacheDirectory: true
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

    plugins: minify
      ? [
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin()
        ]
      : []
  }
}
