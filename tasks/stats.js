'use strict'

const path = require('path')
const { gzip } = require('zlib')
const _ = require('lodash')
const { green } = require('chalk')
const { padEnd, padStart, round } = _

module.exports = function * (task) {
  const stats = []

  yield task
    .source(path.resolve(__dirname, '../ko-component-router.*'))
    .run({ every: true }, function * ({ base: name, data }) {
      const gzipped = yield new Promise((resolve) => gzip(data, (_, result) => resolve(result)))
      const kilobytes = round(Buffer.byteLength(data, 'utf8') / 1000)
      const compressedKilobytes = round(Buffer.byteLength(gzipped, 'utf8') / 1000)

      stats.push([name, kilobytes, compressedKilobytes])
    })
    .run({ every: false }, function * () { // eslint-disable-line require-yield
      const border = '-------------------------------------------------------------'
      const padLeftWidth = 'ko-component-router.min.js'.length + 3
      const padRightWidth = border.length - 4 - padLeftWidth
      console.log(green(border)) // eslint-disable-line no-console
      _(stats)
        .sortBy(([name]) => name)
        .each(([name, raw, gzipped]) =>
          console.log(green(  // eslint-disable-line no-console
            '|',
            (padEnd(name, padLeftWidth) + padStart(`~${raw}kb   ~${gzipped}kb gzipped`, padRightWidth)),
            '|')))
      console.log(green(border))  // eslint-disable-line no-console
    })
}
