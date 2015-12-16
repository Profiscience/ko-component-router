'use strict'

const pathtoRegexp = require('path-to-regexp')
const utils = require('./utils')

class Route {
  constructor(path, args) {
    if (path[path.length - 1] === '!') {
      path = path.replace('!', ':child_path(.*)?')
    } else if (path === '*') {
      path = '(.*)'
    }

    if (typeof args === 'string') {
      this.callbacks = [this.getComponentSetter(args)]
    } else {
      this.callbacks = args.map((h) => typeof h === 'string' ? this.getComponentSetter(h) : h)
    }

    this._keys = []
    this._regexp = pathtoRegexp(path, this._keys)
    this._compile = pathtoRegexp.compile(path)
  }

  exec(ctx, push) {
    const callbacks = this.callbacks
    let i = 0

    next()

    function next() {
      const fn = callbacks[i++]

      if (fn) {
        fn(ctx, next)
      } else {
        history[push ? 'pushState' : 'replaceState'](
          ctx.state(),
          document.title,
          '' === ctx.canonicalPath() ? ctx.config.base : ctx.canonicalPath())
      }
    }
  }

  matches(path) {
    return this._regexp.exec(decodeURIComponent(path))
  }

  getComponentSetter(c) {
    return (ctx, next) => {
      ctx.component(c)
      next()
    }
  }

  compile(params) {
    return this._compile(params)
  }

  parse(path) {
    let childPath
    let hash
    const params = {}
    const hIndex = path.indexOf('#')

    if (~hIndex) {
      const parts = path.split('#')
      path = parts[0]
      hash = utils.decodeURLEncodedURIComponent(parts[1]) || ''
    }

    const qsIndex = path.indexOf('?')
    const pathname = ~qsIndex ? path.slice(0, qsIndex) : path
    const matches = this._regexp.exec(decodeURIComponent(pathname))

    for (let i = 1, len = matches.length; i < len; ++i) {
      const k = this._keys[i - 1]
      const v = utils.decodeURLEncodedURIComponent(matches[i])
      if (v !== undefined || !(hasOwnProperty.call(params, k.name))) {
        if (k.name === 'child_path') {
          childPath = `/${v}`
          path = path.replace(childPath, '')
        } else {
          params[k.name] = v
        }
      }
    }

    return [path, params, hash, pathname]
  }
}

module.exports = Route
