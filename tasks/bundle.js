const path = require('path')
const typescript = require('typescript')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const typescriptPlugin = require('rollup-plugin-typescript')

let cache

module.exports = function * (fly) {
  yield fly.source(path.resolve(__dirname, '../src/index.ts'))
    .rollup({
      rollup: {
        cache,
        plugins: [
          typescriptPlugin({ typescript }),
          nodeResolve({
            preferBuiltins: false,
            // TODO why do I need to skip this external?
            // skip: ['knockout']
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
        }
      }
    })
    .concat({ output: 'ko-component-router.js' })
    .target(path.resolve(__dirname, '../dist'))

    .uglify()
    .concat({ output: 'ko-component-router.min.js' })
    .target(path.resolve(__dirname, '../dist'))
}
