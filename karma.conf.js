'use strict' // eslint-disable-line

const path = require('path')

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['tap'],

    files: ['test/index.js'],

    preprocessors: {
      'test/index.js': 'webpack'
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
              plugins: [
                'transform-async-functions',
                'transform-es2015-modules-commonjs',
                'transform-object-rest-spread',
                'transform-regenerator',
                'transform-runtime'
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
    },

    isparta: {
      embedSource: true,
      noAutoWrap: true
    }
  })
}
