'use strict'

const path = require('path')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

let cache

module.exports = {
  * 'bundle'(task) {
    yield task
      .source(path.resolve(__dirname, '../dist/index.js'))
      .rollup({
        cache,
        external: ['knockout'],
        plugins: [
          nodeResolve({
            preferBuiltins: false
          }),
          commonjs()
        ],
        output: {
          file: `ko-component-router.js`,
          format: 'umd',
          exports: 'named', // const { Router, Route, Context, ... } = ko.router
          globals: {
            knockout: 'ko'
          },
          name: 'ko.router'
        }
      })
      .target(path.resolve(__dirname, '../'))

      .uglify()
      .rename({ suffix: '.min' })
      .target(path.resolve(__dirname, '../'))
  }
}