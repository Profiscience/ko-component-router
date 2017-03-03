
exports.bundle = require('./tasks/bundle')
exports.modules = require('./tasks/modules')
exports.stats = require('./tasks/stats')
exports.test = require('./tasks/test')

exports.build = function * (fly) {
  yield fly.parallel(['modules', 'bundle'])
  yield fly.start('stats')
}

exports.watch = function * (fly) {
  yield fly.start('build')
  yield fly.watch('src/*.ts', 'build')
}
