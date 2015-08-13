var istanbul = require('browserify-istanbul')

module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['browserify', 'mocha'],

    files: [
      'test/**/*.spec.js'
    ],

    preprocessors: {
      'test/**/*.spec.js': ['browserify']
    },

    reporters: ['mocha', 'coverage'],

    browsers: ['PhantomJS'],

    browserify: {
      debug: true,
      transform: [istanbul({
        ignore: ['**/node_modules/**', '**/test/**', '**/tests/**']
      })]
    },

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false
  })
}
