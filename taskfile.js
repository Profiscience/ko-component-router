'use strict'

Object.assign(exports, require('./tasks/test'))
Object.assign(exports, require('./tasks/bundle'))
exports.compile = require('./tasks/compile')
exports.stats = require('./tasks/stats')

exports.build = function* (task) {
  yield task.clear('dist')
  yield task.serial(['compile', 'bundle', 'stats'])
}

exports.watch = function * (task) {
  yield task.start('build')
  yield task.watch('src/*.ts', 'build')
}
