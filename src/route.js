import pathtoRegexp from 'path-to-regexp'
import Router from './router'
import { flatMap, isArray, isFunction, isPlainObject, isString } from './utils'

export default class Route {
  constructor(path, middleware) {
    this.middleware = flatMap(isArray(middleware) ? middleware : [middleware], (m) => {
      const pluginMiddleware = Router.plugins.reduce((ms, p) => {
        const _m = p(m)
        return _m ? ms.concat(isArray(_m) ? _m : [_m]) : ms
      }, [])
      return pluginMiddleware.length > 0
        ? pluginMiddleware
        : m
    }).reduce((ms, m) => {
      if (isString(m)) {
        this.component = m
      } else if (isPlainObject(m)) {
        path = path.replace(/\/?!?$/, '/!')
        this.children = Object.entries(m).map(([r, m]) => new Route(r, m))
        if (!this.component) {
          this.component = 'ko-component-router'
        }
      } else if (isFunction(m)) {
        ms.push(m)
      }
      return ms
    }, [])

    if (path[path.length - 1] === '!') {
      path = path.replace('!', ':__child_path__(.*)?')
    } else {
      path = path.replace(/\(?\*\)?/, '(.*)')
    }

    this.path = path
    this._keys = []
    this._regexp = pathtoRegexp(path, this._keys)
  }

  matches(path) {
    const matches = this._regexp.exec(path)
    if (matches === null) {
      return false
    }
    if (this.children) {
      for (const childRoute of this.children) {
        const childPath = '/' + (matches[matches.length - 1] || '')
        if (childRoute.matches(childPath)) {
          return true
        }
      }
      return false
    }

    return true
  }

  parse(path) {
    let childPath
    const params = {}
    const matches = this._regexp.exec(path)

    for (let i = 1, len = matches.length; i < len; ++i) {
      const k = this._keys[i - 1]
      const v = matches[i] || ''
      if (k.name === '__child_path__') {
        childPath = '/' + v
      } else {
        params[k.name] = v
      }
    }

    return [params, path.replace(new RegExp(childPath + '$'), ''), childPath]
  }

  static createRoutes(routes) {
    return Object.entries(routes).map(([r, m]) => new Route(r, m))
  }
}
