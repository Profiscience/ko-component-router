import * as pathtoRegexp from 'path-to-regexp'
import { RouteMap, Middleware } from './router'
import { isFunction, isPlainObject, isString, isUndefined, map, reduce } from './utils'

export type RouteConfig = string | RouteMap | Middleware

export class Route {
  /* eslint-disable */
  path:       string
  component:  string
  middleware: Array<Middleware>
  children:   Array<Route>
  keys

  private regexp: RegExp
  /* eslint-enable */

  constructor(path: string, config: Array<RouteConfig>) {
    const [component, middleware, children] = Route.parseConfig(config)
    this.path = path
    this.component = component
    this.middleware = middleware
    this.children = children

    const [keys, regexp] = Route.parsePath(path, !isUndefined(children))
    this.keys = keys
    this.regexp = regexp as RegExp
  }

  matches(path) {
    const matches = this.regexp.exec(path)
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

  parse(path): [Object, string, string] {
    let childPath
    const params = {}
    const matches = this.regexp.exec(path)

    for (let i = 1, len = matches.length; i < len; ++i) {
      const k = this.keys[i - 1]
      const v = matches[i] || ''
      if (k.name === '__child_path__') {
        childPath = '/' + v
        path = path.replace(new RegExp(childPath + '$'), '')
      } else {
        params[k.name] = v
      }
    }

    return [params, path, childPath]
  }

  static parseConfig(config): [string, Array<Middleware>, Array<Route>] {
    let component: string
    let children: Array<Route>

    const middleware = reduce(
      config,
      (
        accum: Array<Middleware>,
        m: string | RouteMap | Middleware
      ) => {
        if (isString(m)) {
          m = m as string
          component = m
        } else if (isPlainObject(m)) {
          m = m as RouteMap
          children = map(m, (routeConfig, path) => new Route(path, routeConfig))
          if (!component) {
            component = 'ko-component-router'
          }
        } else if (isFunction(m)) {
          m = m as Middleware
          accum.push(m)
        }
        return accum
      }, [])

    return [component, middleware, children]
  }

  static parsePath(path, hasChildren) {
    if (hasChildren) {
      path = path.replace(/\/?!?$/, '/!')
    }

    if (path[path.length - 1] === '!') {
      path = path.replace('!', ':__child_path__(.*)?')
    } else {
      path = path.replace(/\(?\*\)?/, '(.*)')
    }

    const keys = []
    const regexp = pathtoRegexp(path, keys)

    return [keys, regexp]
  }
}
