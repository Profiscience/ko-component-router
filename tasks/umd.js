const path = require('path')
const spawn = require('cross-spawn')

module.exports = function * () {
  yield new Promise((resolve) => {
    const tsc = spawn('tsc', [
      '--module', 'umd',
      '--outDir', path.resolve(__dirname, '../dist/umd')
    ])
    tsc.on('close', resolve)
  })
}
