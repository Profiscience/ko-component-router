'use strict'

const path = require('path')
const { Server } = require('karma')
const nodeResolve = require('rollup-plugin-node-resolve')
const nodeBuiltins = require('rollup-plugin-node-builtins')
const nodeGlobals = require('rollup-plugin-node-globals')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const rollupIstanbul = require('rollup-plugin-istanbul')

let cache, watch, coverage

module.exports = {
  * test(task) {
    coverage = true
    watch = false

    yield task.serial(['compile', 'karma'])
  },
  * 'test:watch'(task) {
    coverage = false
    watch = true

    yield task.watch(path.resolve(__dirname, '../src/**/*.ts'), 'compile')
    yield task.serial(['compile', 'karma'])
  },
  * karma() { // eslint-disable-line require-yield
    const config = {
      basePath: path.resolve(__dirname, '..'),

      frameworks: ['tap'],

      files: [
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
          nodeResolve({
            preferBuiltins: true
          })
        ],
        format: 'iife',
        sourcemap: 'inline'
      },
    }

    if (coverage) {
      config.rollupPreprocessor.plugins.push(
        rollupIstanbul({
          include: [
            'dist/**/*'
          ]
        }))

      config.remapIstanbulReporter = {
        reports: {
          lcovonly: 'coverage/lcov.info',
          html: 'coverage/html'
        }
      }
    }

    new Server(config, (code) => process.exit(code)).start()
  }
}
