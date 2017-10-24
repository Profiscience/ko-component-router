'use strict'

const path = require('path')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

let cache

module.exports = function * (fly) {
  yield fly.source(path.resolve(__dirname, '../dist/modules/index.js'))
    .rollup({
      rollup: {
        cache,
        plugins: [
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

        // const { Router, Route, Context } = ko.router
        exports: 'named'
      }
    })

    .rename({ basename: 'ko-component-router', extname: '.js' })
    .target(path.resolve(__dirname, '../dist'))

    .uglify()
    .rename({ suffix: '.min' })
    .target(path.resolve(__dirname, '../dist'))
}
