'use strict'

const pathtoRegexp = require('path-to-regexp')
const utils = require('./utils')

class Route {
  constructor(path, ctx) {
    this.ctx = ctx
    this.path = (path === '*') ? '(.*)' : path
    this.regexp = pathtoRegexp(this.path, this.keys = [])
    this.compile = pathtoRegexp.compile(this.path)
  }

  middleware(fn) {
    return (ctx, next) => {
      if (this.match()) {
        return fn(ctx, next)
      }
      next()
    }
  }

  match() {
    const params = {}
    const qsIndex = this.ctx.path().indexOf('?')
    const pathname = ~qsIndex ? this.ctx.path().slice(0, qsIndex) : this.ctx.path()
    const matches = this.regexp.exec(decodeURIComponent(pathname))

    if (!matches) {
      return false
    }

    for (let i = 1, len = matches.length; i < len; ++i) {
      const key = this.keys[i - 1]
      let val = utils.decodeURLEncodedURIComponent(matches[i])
      if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
        if (key.name === 'child_path') {
          val = `/${val}`
          this.ctx.path(this.ctx.path().replace(val, ''))
        } else {
          params[key.name] = val
        }
      }
    }

    this.ctx.route(this)
    utils.merge(this.ctx.params, params)

    return true
  }
}

module.exports = Route
