'use strict'

const path = require('path')
const { gzip } = require('zlib')
const { each, padEnd, round } = require('lodash')
const { green } = require('chalk')

module.exports = function * (fly) {
  const stats = []

  yield fly.source(path.resolve(__dirname, '../dist/ko-component-router.*'))
    .run({ every: true }, function * ({ base: name, data }) {
      const gzipped = yield new Promise((resolve) => gzip(data, (_, result) => resolve(result)))
      const kilobytes = round(Buffer.byteLength(data, 'utf8') / 1000)
      const compressedKilobytes = round(Buffer.byteLength(gzipped, 'utf8') / 1000)

      stats.push([name, kilobytes, compressedKilobytes])
    })
    .run({ every: false }, function * () {
      const border = '-------------------------------------------------------------'
      console.log(green(border))
      each(stats, ([name, raw, gzipped]) =>
        console.log(green(
          '|',
          padEnd(
            (padEnd(name, 'dist/ko-component-router.min.js'.length) + `\t~${raw}kb\t~${gzipped}kb gzipped`),
            border.length - 5
          ),
          '|')))
      console.log(green(border))
    })
}
