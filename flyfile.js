'use strict'

const { extend } = require('lodash')

extend(exports, require('./tasks/test'))
exports.bundle = require('./tasks/bundle')
exports.modules = require('./tasks/modules')
exports.stats = require('./tasks/stats')
exports.typings = require('./tasks/typings')
exports.umd = require('./tasks/umd')

exports.build = function * (fly) {
  yield fly.parallel(['modules', 'umd', 'typings'])
  yield fly.start('bundle')
  yield fly.start('stats')
}

exports.watch = function * (fly) {
  yield fly.start('build')
  yield fly.watch('src/*.ts', 'build')
}
