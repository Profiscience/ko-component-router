import pathtoRegexp from 'path-to-regexp'
import { RouteMap, Middleware } from './router'
import { isFunction, isPlainObject, isString, isUndefined, map, reduce } from './utils'

export type RouteConfig = string | RouteMap | Middleware

export class Route {
  public path: string
  public component: string
  public middleware: Middleware[]
  public children: Route[]
  public keys: pathtoRegexp.Key[]

  private regexp: RegExp

  constructor(path: string, config: RouteConfig[]) {
    const [component, middleware, children] = Route.parseConfig(config)
    this.path = path
    this.component = component
    this.middleware = middleware
    this.children = children

    const { keys, regexp } = Route.parsePath(path, !isUndefined(children))
    this.keys = keys
    this.regexp = regexp
  }

  public matches(path: string) {
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

  public parse(path: string): { params: { [k: string]: any }, pathname: string, childPath: string } {
    let childPath
    let pathname = path
    const params: { [k: string]: any } = {}
    const matches = this.regexp.exec(path)

    for (let i = 1, len = matches.length; i < len; ++i) {
      const k = this.keys[i - 1]
      const v = matches[i] || ''
      if (k.name === '__child_path__') {
        childPath = '/' + v
        pathname = path.replace(new RegExp(childPath + '$'), '')
      } else {
        params[k.name] = v
      }
    }

    return { params, pathname, childPath }
  }

  private static parseConfig(config: (string | RouteMap | Middleware)[]): [string, Middleware[], Route[]] {
    let component: string
    let children: Route[]

    const middleware = reduce(
      config,
      (
        accum: Middleware[],
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

  private static parsePath(path: string, hasChildren: boolean) {
    if (hasChildren) {
      path = path.replace(/\/?!?$/, '/!')
    }

    if (path[path.length - 1] === '!') {
      path = path.replace('!', ':__child_path__(.*)?')
    } else {
      path = path.replace(/\(?\*\)?/, '(.*)')
    }

    const keys: pathtoRegexp.Key[] = []
    const regexp = pathtoRegexp(path, keys)

    return { keys, regexp }
  }
}
