'use strict'

const ko = require('knockout')
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
          ctx.config.hashbang && ctx.path() !== '/'
            ? '#!' + ctx.path()
            : ctx.canonicalPath())
      }
    }
  }

  matches(path) {
    return this._regexp.exec(decodeURIComponent(path))
  }

  getComponentSetter(c) {
    return (ctx, next) => {
      let subs = []
      ctx.component(c)

      for (const paramName in ctx.params) {
        const param = ctx.params[paramName]
        subs.push(param.subscribe(() => {
          const url = ctx.route().compile(ko.toJS(ctx.params))
          ctx.update(this, url, null, false)
        }))
      }

      const killMe = ctx.component.subscribe(() => {
        killMe.dispose()
        for (const sub of subs) {
          sub.dispose()
        }
        subs = []
      })

      next()
    }
  }

  compile(params) {
    return this._compile(params)
  }

  parse(path) {
    let childPath
    const params = {}
    const qsIndex = path.indexOf('?')
    const pathname = ~qsIndex ? path.slice(0, qsIndex) : path
    const matches = this._regexp.exec(decodeURIComponent(pathname))

    for (let i = 1, len = matches.length; i < len; ++i) {
      const k = this._keys[i - 1]
      const v = utils.decodeURLEncodedURIComponent(matches[i])
      if (v !== undefined || !(hasOwnProperty.call(params, k.name))) {
        if (k.name === 'child_path') {
          childPath = `/${v}`
        } else {
          params[k.name] = v
        }
      }
    }

    return [params, childPath]
  }
}

module.exports = Route
