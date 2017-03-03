// eslint-disable-next-line
console.info(`Usage:
  --chrome    open in chrome
  --firefox   open in firefox
  --watch     keep alive and re-run on change

  e.g. "npm test -- --chrome --watch"
`)

const path = require('path')
const { watch, chrome, firefox } = require('minimist')(process.argv.slice(2))
const { Server } = require('karma')

// const typescript = require('typescript')
// const nodeResolve = require('rollup-plugin-node-resolve')
// const commonjs = require('rollup-plugin-commonjs')
// const typescriptPlugin = require('rollup-plugin-typescript')

const browsers = []
if (chrome) {
  browsers.push('_Chrome')
}
if (firefox) {
  browsers.push('_Firefox')
}

const reporters = ['dots', 'karma-typescript']

const config = {
  basePath: path.resolve(__dirname, '..'),

  frameworks: ['tap', 'karma-typescript'],

  files: [
    // 'node_modules/regenerator-runtime/runtime.js',
    'test/index.ts'
  ],

  preprocessors: {
    '**/*.ts': 'karma-typescript'
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

  reporters,

  // coverageReporter: {
  //   dir: 'coverage/',
  //   reporters: [
  //     { type: 'html', subdir: 'html' },
  //     { type: 'lcovonly', subdir: '.', file: 'lcov.txt' }
  //   ]
  // },

  // rollupPreprocessor: {
  //   plugins: [
  //     typescriptPlugin({ typescript }),
  //     nodeResolve({
  //       preferBuiltins: false,
  //       // TODO why do I need to skip this external?
  //       // skip: ['knockout']
  //     }),
  //     commonjs()
  //   ]
  // }
}

// compile().then(() => {
//   const server = new Server(config, (code) => process.exit(code)) // eslint-disable-line
// server.start()
// })

module.exports = function * (fly) {
  const server = new Server(config, (code) => process.exit(code))

  if (watch) {
    yield fly.watch()
  } else {
    server.start()
    yield new Promise((resolve) => server.on('run_complete', resolve))
  }
}
