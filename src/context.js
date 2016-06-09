import ko from 'knockout'
import qs from 'qs'
import { factory as queryFactory } from './query'
import { factory as stateFactory } from './state'
import { extend, isUndefined } from './utils'

export default class Context {
  constructor(bindingCtx, config) {
    bindingCtx.$router = this

    let parentRouterBindingCtx = bindingCtx
    let isRoot = true
    while (parentRouterBindingCtx.$parentContext) {
      parentRouterBindingCtx = parentRouterBindingCtx.$parentContext
      if (parentRouterBindingCtx.$router) {
        isRoot = false
        break
      } else {
        parentRouterBindingCtx.$router = this
      }
    }

    if (isRoot) {
      ko.router = this
    } else {
      this.$parent = parentRouterBindingCtx.$router
      this.$parent.$child = this
      config.base = this.$parent.pathname()
    }

    this.config = config
    this.config.depth = Context.getDepth(this)

    this.isNavigating = ko.observable(true)

    this.route = ko.observable('')
    this.canonicalPath = ko.observable('')
    this.path = ko.observable('')
    this.pathname = ko.observable('')
    this.hash = ko.observable('')
    this.params = {}
    this.query = queryFactory(this)
    this.state = stateFactory(this)

    this._beforeNavigateCallbacks = []
  }

  update(origUrl = this.canonicalPath(), state = false, push = true, query = false) {
    const url = this.resolveUrl(origUrl)
    const route = this.getRouteForUrl(url)
    const firstRun = this.route() === ''

    if (!route) {
      return this.$parent ? this.$parent.update(...arguments) : false
    }

    const fromCtx = this.toJS()
    const [path, params, hash, pathname, querystring, childPath] = route.parse(url)
    const samePage = this.pathname() === pathname

    let shouldNavigatePromise = Promise.resolve(true)
    if (!samePage && !firstRun) {
      shouldNavigatePromise = this.runBeforeNavigateCallbacks()
      this.isNavigating(true)
      this.reload()
    }

    return shouldNavigatePromise.then((shouldNavigate) => {
      if (!shouldNavigate) {
        return Promise.resolve(false)
      }

      this._beforeNavigateCallbacks = []

      if (!query && querystring) {
        query = qs.parse(querystring)[this.config.depth + pathname]
      }

      const canonicalPath = Context
        .getCanonicalPath(
          this.getBase().replace(/\/$/, ''),
          pathname,
          childPath,
          this.query.getFullQueryString(query, pathname),
          hash)

      const toCtx = {
        route,
        path,
        pathname,
        canonicalPath,
        hash,
        params,
        query
      }

      if (state === false && samePage) {
        extend(toCtx, { state: fromCtx.state }, false)
      } else if (!this.config.persistState && state) {
        toCtx.state = state
      }

      if (this.config.persistState) {
        toCtx.state = this.state()
      }

      history[push ? 'pushState' : 'replaceState'](
        history.state,
        document.title,
        '' === canonicalPath ? this.getBase() : canonicalPath)

      return new Promise((resolve) => {
        if (firstRun) {
          complete.call(this, true)
        } else if (!samePage) {
          this.config.outTransition(this.config.el, fromCtx, toCtx, complete.bind(this))
          if (this.config.outTransition.length !== 4) {
            complete.call(this, true)
          }
        } else if (this.$child) {
          this.$child.update(childPath || '/', {}, false, {})
          complete.call(this)
        } else {
          complete.call(this)
        }

        function complete(animate) {
          const el = this.config.el.getElementsByClassName('component-wrapper')[0]
          delete toCtx.query
          extend(this, toCtx)
          if (query) {
            this.query.update(query, pathname)
          }
          this.isNavigating(false)
          ko.tasks.runEarly()
          resolve(true)

          if (animate) {
            ko.tasks.schedule(() =>
              this.config.inTransition(el, fromCtx, toCtx))
          }
        }
      })
    })
  }

  addBeforeNavigateCallback(cb) {
    this._beforeNavigateCallbacks.push(cb)
  }

  runBeforeNavigateCallbacks() {
    let ctx = this
    let callbacks = []

    while (ctx) {
      callbacks = ctx._beforeNavigateCallbacks.concat(callbacks)
      ctx = ctx.$child
    }

    return run(callbacks)

    function run(callbacks) {
      return new Promise((resolve) => {
        if (callbacks.length === 0) {
          return resolve(true)
        }
        const cb = callbacks.shift()
        const recursiveResolve = (shouldUpdate = true) => shouldUpdate
          ? run(callbacks).then(resolve)
          : resolve(false)

        if (cb.length === 1) {
          cb(recursiveResolve)
        } else {
          const v = cb()
          if (isUndefined(v) || typeof v.then !== 'function') {
            recursiveResolve(v)
          } else {
            v.then(recursiveResolve)
          }
        }
      })
    }
  }

  getRouteForUrl(url) {
    const pathname = url
      .split('#')[0]
      .split('?')[0]

    let matchingRouteWithFewestDynamicSegments
    let fewestMatchingSegments = Infinity

    for (const rn in this.config.routes) {
      const r = this.config.routes[rn]
      if (r.matches(pathname)) {
        if (r._keys.length === 0) {
          return r
        } else if (fewestMatchingSegments === Infinity ||
          (r._keys.length < fewestMatchingSegments && r._keys[0].pattern !== '.*')) {
          fewestMatchingSegments = r._keys.length
          matchingRouteWithFewestDynamicSegments = r
        }
      }
    }
    return matchingRouteWithFewestDynamicSegments
  }

  destroy() {
    if (this.$child) {
      this.$child.destroy()
      delete this.$child
    }

    this.query.dispose()
    this.state.dispose()
  }

  reload() {
    if (this.$child) {
      this.$child.destroy()
      delete this.$child
    }

    this.query.reload()
    this.state.reload()
  }

  resolveUrl(origUrl) {
    let url = (origUrl + '').replace('/#!', '')
    if (url.indexOf('./') === 0) {
      url = url.replace('./', '/')
    } else {
      let p = this
      while (p && url.indexOf(p.config.base) > -1) {
        url = url.replace(p.config.base, '')
        p = p.$parent
      }
    }
    return url
  }

  toJS() {
    return ko.toJS({
      route: this.route,
      path: this.path,
      pathname: this.pathname,
      canonicalPath: this.canonicalPath,
      hash: this.hash,
      state: this.state,
      params: this.params,
      query: this.query.getAll(false, this.pathname())
    })
  }

  getBase() {
    let base = ''
    let p = this
    while (p) {
      base = p.config.base + (!p.config.hashbang || p.$parent ? '' : '/#!') + base
      p = p.$parent
    }
    return base
  }

  static getCanonicalPath(base, pathname, childPath = '', querystring, hash = '') {
    return `${base}${pathname}${childPath}${querystring ? '?' + querystring : ''}${hash ? '#' + hash : ''}`
  }

  static getDepth(ctx) {
    let depth = 0
    while (ctx.$parent) {
      ctx = ctx.$parent
      depth++
    }
    return depth
  }
}
