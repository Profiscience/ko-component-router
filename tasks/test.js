'use strict'

const path = require('path')
const { Server } = require('karma')
const nodeResolve = require('rollup-plugin-node-resolve')
const nodeBuiltins = require('rollup-plugin-node-builtins')
const nodeGlobals = require('rollup-plugin-node-globals')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const rollupIstanbul = require('rollup-plugin-istanbul')

let cache, watch

module.exports = {
  * test(fly) {
    watch = false

    yield fly.serial(['modules', 'karma'])
  },
  * 'test:watch'(fly) {
    watch = true

    yield fly.start('karma')
    yield fly.watch(path.resolve(__dirname, '../src/**/*.ts'), 'modules')
  },
  * karma() { // eslint-disable-line require-yield
    const config = {
      basePath: path.resolve(__dirname, '..'),

      frameworks: ['tap'],

      files: [
        { pattern: 'dist/modules/**/*.js', included: false },
        'test/index.js'
      ],

      preprocessors: {
        'test/index.js': 'rollup'
      },

      browsers: [
        process.env.TRAVIS ? '_Firefox' : '_Chrome'
      ],

      customLaunchers: {
        _Chrome: {
          base: 'Chrome',
          flags: ['--incognito']
        },
        _Firefox: {
          base: 'Firefox',
          flags: ['-private']
        },
      },

      autoWatch: watch,

      singleRun: !watch,

      reporters: ['mocha', 'karma-remap-istanbul'],

      rollupPreprocessor: {
        cache,
        plugins: [
          json(),
          commonjs({
            namedExports: {
              knockout: [
                'applyBindings',
                'applyBindingsToNode',
                'bindingHandlers',
                'components',
                'observable',
                'pureComputed',
                'tasks',
                'unwrap'
              ]
            }
          }),
          nodeGlobals(),
          nodeBuiltins(),
          // rollupIstanbul({
          //   include: [
          //     'dist/**/*'
          //   ]
          // }),
          nodeResolve({
            preferBuiltins: true
          })
        ],
        format: 'iife',
        sourceMap: 'inline'
      },

      // remapIstanbulReporter: {
      //   reports: {
      //     lcovonly: 'coverage/lcov.info',
      //     html: 'coverage/html'
      //   }
      // }
    }

    const server = new Server(config, (code) => process.exit(code))
    server.start()
  }
}
