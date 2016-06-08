'use strict' // eslint-disable-line

const path = require('path')

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['tap'],

    files: ['test.js'],

    preprocessors: {
      'test.js': 'webpack'
    },

    browsers: ['Firefox'],

    singleRun: true,

    reporters: ['dots', 'coverage'],

    coverageReporter: {
      dir : 'coverage/',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.txt' }
      ]
    },

    webpack: {
      node: {
        fs: 'empty'
      },
      isparta: {
        embedSource: true,
        noAutoWrap: true
      },
      module: {
        preLoaders: [
          {
            test: /\.js$/,
            exclude: [
              path.resolve('src/!(utils)'),
              path.resolve('node_modules/')
            ],
            loader: 'babel',
            query: {
              'plugins': [
                'transform-es2015-modules-commonjs',
                'syntax-async-functions',
                'transform-runtime',
                'transform-regenerator'
              ],
              presets: ['es2015']
            }
          },
          {
            test: /\.js$/,
            include: path.resolve('src/'),
            exclude: /utils/,
            loader: 'isparta'
          }
        ]
      }
    },

    webpackMiddleware: {
      noInfo: true
    }
  })
}
