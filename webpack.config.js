'use strict'

module.exports = {
  entry: './src/index.js',

  output: {
    path: 'dist',
    filename: 'ko-component-router.js',
    library:  'ko-component-router',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: 'babel' }
    ]
  },

  externals: {
    'knockout': {
      root: 'ko',
      commonjs: 'knockout',
      commonjs2: 'knockout',
      amd: 'knockout'
    }
  }
}
