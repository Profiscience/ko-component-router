'use strict'

const path = require('path')

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['tap'],

    files: [
      'test/index.js'
    ],

    preprocessors: {
      'test/index.js': 'webpack'
    },

    port: 9876,
    colors: true,
    browsers: ['Chrome'],

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    autoWatch: true,
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity,

    reporters: ['dots', 'coverage', 'osx'],

    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
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
              path.resolve('src/'),
              path.resolve('node_modules/')
            ],
            loader: 'babel'
          },
          {
            test: /\.js$/,
            include: path.resolve('src/'),
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
