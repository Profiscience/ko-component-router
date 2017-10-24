'use strict'

const path = require('path')
const spawn = require('cross-spawn')
const { Server } = require('karma')
const nodeResolve = require('rollup-plugin-node-resolve')
const nodeBuiltins = require('rollup-plugin-node-builtins')
const nodeGlobals = require('rollup-plugin-node-globals')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const rollupIstanbul = require('rollup-plugin-istanbul')

let cache, watch, coverage

module.exports = {
  * test(fly) {
    watch = false
    coverage = true

    yield fly.serial(['test:build', 'karma'])
  },
  * 'test:watch'(fly) {
    coverage = false
    watch = true

    yield fly.watch(path.resolve(__dirname, '../src/**/*.ts'), 'test:build')
    yield fly.serial(['test:build', 'karma'])
  },
  * 'test:build'() {
    yield new Promise((resolve) => {
      const tsc = spawn('tsc', [
        '--target', coverage ? 'es5' : 'es2017',
        '--module', 'es2015',
        '--outDir', path.resolve(__dirname, '../dist/test')
      ], { stdio: 'inherit' })
      tsc.on('close', resolve)
    })
  },
  * karma() {
    const config = {
      basePath: path.resolve(__dirname, '..'),

      frameworks: ['tap'],

      files: [
        { pattern: 'dist/test/**/*.js', included: false },
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
        sourceMap: 'inline'
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

    const server = new Server(config, (code) => process.exit(code))
    server.start()
  }
}
