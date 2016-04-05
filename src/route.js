'use strict'

const pathtoRegexp = require('path-to-regexp')
const { decodeURLEncodedURIComponent, isUndefined } = require('./utils')

class Route {
  constructor(path, component) {
    if (path[path.length - 1] === '!') {
      path = path.replace('!', ':child_path(.*)?')
    } else {
      path = path.replace(/\(?\*\)?/, '(.*)')
    }

    this.component = component

    this._keys = []
    this._regexp = pathtoRegexp(path, this._keys)
  }

  matches(path) {
    const qsIndex = path.indexOf('?')

    if (~qsIndex) {
      path = path.split('?')[0]
    }

    return this._regexp.exec(decodeURIComponent(path))
  }

  parse(path) {
    let childPath
    let hash = ''
    const params = {}
    const hIndex = path.indexOf('#')

    if (~hIndex) {
      const parts = path.split('#')
      path = parts[0]
      hash = decodeURLEncodedURIComponent(parts[1])
    }

    const qsIndex = path.indexOf('?')
    let pathname, querystring // eslint-disable-line
    [pathname, querystring] = ~qsIndex ? path.split('?') : [path]
    const matches = this._regexp.exec(decodeURIComponent(pathname))

    for (let i = 1, len = matches.length; i < len; ++i) {
      const k = this._keys[i - 1]
      const v = decodeURLEncodedURIComponent(matches[i])
      if (!isUndefined(v)|| !(hasOwnProperty.call(params, k.name))) {
        if (k.name === 'child_path') {
          if (!isUndefined(v)) {
            childPath = `/${v}`
            path = path.substring(0, path.lastIndexOf(childPath))
            pathname = pathname.substring(0, pathname.lastIndexOf(childPath))
          }
        } else {
          params[k.name] = v
        }
      }
    }

    return [path, params, hash, pathname, querystring, childPath]
  }
}

module.exports = Route
