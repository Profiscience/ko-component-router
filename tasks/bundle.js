const path = require('path')
const { extend } = require('lodash')
const typescript = require('typescript')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const { default: typescriptPlugin } = require('rollup-plugin-ts')
const { compilerOptions } = require('../tsconfig.json')

let cache

module.exports = function * (fly) {
  yield fly.source(path.resolve(__dirname, '../src/index.ts'))
    .rollup({
      rollup: {
        cache,
        plugins: [
          typescriptPlugin({
            typescript,
            tsconfig: extend({}, compilerOptions, { sourceMap: false })
          }),
          nodeResolve({
            preferBuiltins: false
          }),
          commonjs()
        ],
        external: ['knockout']
      },
      bundle: {
        format: 'umd',
        moduleName: 'ko.router',
        globals: {
          knockout: 'ko'
        },

        // ko.router.default === Router
        // ko.router.Context === Context
        // ko.router.Route === Route
        exports: 'named'
      }
    })

    .rename({ basename: 'ko-component-router', extname: '.js' })
    .target(path.resolve(__dirname, '../dist'))

    .uglify()
    .rename({ suffix: '.min' })
    .target(path.resolve(__dirname, '../dist'))
}
