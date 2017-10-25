'use strict'

const execa = require('execa')

module.exports = function* () {
  yield execa('tsc', { stdio: 'inherit' })
}
