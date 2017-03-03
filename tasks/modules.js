const path = require('path')
const typescript = require('typescript')
const typescriptConfig = require('../tsconfig.json')

module.exports = function * (fly) {
  yield fly.source(path.resolve(__dirname, '../src/*.ts'))
    .run({ every: true }, function * ({ data }) {
      typescript.transpile(data.toString(), typescriptConfig)
      yield Promise.resolve()
    })
    .target(path.resolve(__dirname, '../dist/modules'))
}
