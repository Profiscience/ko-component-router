// eslint-disable-next-line
console.info(`Usage:
  --chrome    open in chrome
  --firefox   open in firefox
  --watch     keep alive and re-run on change

  e.g. "npm test -- --chrome --watch"
`)

const path = require('path')
const { watch, chrome, firefox } = require('minimist')(process.argv.slice(2))
// const { Server } = require('karma')
// const { exclude } = require('../tsconfig.json')

const browsers = []
if (chrome) {
  browsers.push('_Chrome')
}
if (firefox) {
  browsers.push('_Firefox')
}

const reporters = ['dots', 'karma-typescript']

module.exports = (config) => config.set({
  basePath: path.resolve(__dirname, '..'),

  frameworks: ['tap', 'karma-typescript'],

  files: [
    { pattern: 'src/**/*.ts' },
    { pattern: 'test/**/*.ts' }
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

  karmaTypescriptConfig: {
    compilerOptions: {
      // 'importHelpers': true,
      moduleResolution: 'node',
      target: 'es6',
      // module: 'commonjs',
      // 'sourceMap': true,
      // 'declaration': true,
      // 'rootDir': './src',
      // 'baseUrl': './src',
      // 'outDir': './dist/modules',
      lib: [
        'dom',
        'es5',
        'es2015.core',
        'es2015.iterable',
        'es2015.promise',
        'es2017.object'
      ],
      types: [
        'node'
      ],
      typeRoots: [
        'node_modules/@types'
      ]
    }
  }
})
