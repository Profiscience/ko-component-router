#!/usr/bin/env node

'use strict' // eslint-disable-line

// eslint-disable-next-line
console.info(`Usage:
  --chrome    open in chrome
  --firefox   open in firefox
  --watch     keep alive and re-run on change

  e.g. "npm test -- --chrome --watch"
`)

const path = require('path')
const { watch, chrome, firefox } = require('minimist')(process.argv.slice(2))
const chokidar = require('chokidar')
const { Server } = require('karma')
const compile = require('./lib/compile')

const browsers = []
if (chrome) {
  browsers.push('_Chrome')
}
if (firefox) {
  browsers.push('_Firefox')
}

const config = {
  basePath: path.resolve(__dirname, '..'),

  frameworks: ['tap'],

  files: [
    'node_modules/regenerator-runtime/runtime.js',
    'test/index.js'
  ],

  preprocessors: {
    'test/index.js': 'webpack'
  },

  browsers,

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
            path.resolve('dist'),
            path.resolve('node_modules')
          ],
          loader: 'babel',
          query: {
            cacheDirectory: true,
          }
        },
        {
          test: /\.js$/,
          include: path.resolve('dist'),
          loader: 'isparta'
        }
      ]
    },

    babel: {
      plugins: [
        'transform-object-rest-spread',
        'transform-es2015-modules-commonjs',
        'transform-regenerator'
      ],
      presets: [
        'es2015',
        'es2017'
      ]
    },

    isparta: {
      embedSource: true,
      noAutoWrap: true,
      babel: {
        plugins: [
          'transform-es2015-modules-commonjs'
        ]
      },
    }
  },

  webpackMiddleware: {
    noInfo: true
  }
}

compile().then(() => {
  const server = new Server(config) // eslint-disable-line
  server.start()
  chokidar.watch(path.resolve(__dirname, '../src')).on('change', () => compile())
})
