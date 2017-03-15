'use strict'

const path = require('path')
const spawn = require('cross-spawn')

module.exports = function * () {
  yield new Promise((resolve) => {
    const tsc = spawn('tsc', [
      '--target', 'es2017',
      '--module', 'es2015',
      '--outDir', path.resolve(__dirname, '../dist/modules')
    ], { stdio: 'inherit' })
    tsc.on('close', resolve)
  })
}
