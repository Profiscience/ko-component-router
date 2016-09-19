'use strict' // eslint-disable-line

const webpack = require('webpack')

module.exports = [
  makeConfig(),
  makeConfig({ minify: true })
]

function makeConfig(o) {
  const minify = o ? o.minify : false
  return {
    entry: './src/index.js',

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
            cacheDirectory: true,
            plugins: ['transform-es2015-modules-commonjs'],
            presets: ['es2015']
          }
        }
      ]
    },

    externals: {
      'knockout': {
        root: 'ko',
        commonjs: 'knockout',
        commonjs2: 'knockout',
        amd: 'knockout'
      }
    },

    // devtool: 'source-map',

    plugins: minify
      ? [
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin()
        ]
      : []
  }
}
