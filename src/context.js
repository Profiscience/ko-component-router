'use strict'

const ko = require('knockout')
const queryFactory = require('./query').factory
const stateFactory = require('./state').factory
const utils = require('./utils')

class Context {
  constructor(bindingCtx, config) {
    let parentRouterBindingCtx = bindingCtx
    while (parentRouterBindingCtx.$parentContext) {
      parentRouterBindingCtx = parentRouterBindingCtx.$parentContext
      if (parentRouterBindingCtx.$router) {
        break
      }
    }

    if (parentRouterBindingCtx.$router) {
      bindingCtx.$router = this
      this.$parent = parentRouterBindingCtx.$router
      this.$parent.$child = this
      config.base = this.$parent.pathname()
    } else {
      parentRouterBindingCtx.$router = this
      ko.router = {
        update: this.update.bind(this)
      }
    }

    this.config = config
    this.config.depth = Context.getDepth(this)

    this.route = ko.observable('')
    this.component = ko.observable()
    this.canonicalPath = ko.observable('')
    this.path = ko.observable('')
    this.pathname = ko.observable('')
    this.hash = ko.observable('')
    this.params = {}
    this.query = queryFactory(this)
    this.state = stateFactory(this)
  }

  update(origUrl = this.canonicalPath(), state = false, push = true, query = false) {
    let url = origUrl.replace('/#!', '')

    let p = this
    while (p) {
      url = url.replace(p.config.base, '')
      p = p.$parent
    }

    const route = this.getRouteForUrl(url)
    const firstRun = this.route() === ''

    if (!route) {
      return this.$parent ? this.$parent.update(...arguments) : false
    }

    const fromCtx = ko.toJS({
      route: this.route,
      path: this.path,
      pathname: this.pathname,
      canonicalPath: this.canonicalPath,
      hash: this.hash,
      state: this.state,
      params: this.params,
      query: this.query.getAll(false, this.pathname())
    })

    const [path, params, hash, pathname, querystring, childPath] = route.parse(url)

    if (query) {
      this.query.update(query, pathname)
    } else if (!this.config.persistQuery) {
      this.query.updateFromString(querystring, pathname)
    }

    query = this.query.getAll(false, pathname)

    const samePage = this.pathname() === pathname
    if (!samePage && !firstRun) {
      this.reload()
    }

    const canonicalPath = Context
      .getCanonicalPath(
        Context.getBase(this).replace(/\/$/, ''),
        pathname,
        childPath,
        this.query.getFullQueryString(),
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
      utils.merge(toCtx, { state: fromCtx.state }, false)
    } else if (!this.config.persistState && state) {
      toCtx.state = {}
      utils.merge(toCtx.state, state, false, true)
    }

    utils.merge(this, toCtx, true)

    if (this.config.persistState) {
      toCtx.state = this.state()
    }

    history[push ? 'pushState' : 'replaceState'](
      history.state,
      document.title,
      '' === canonicalPath ? Context.getBase(this) : canonicalPath)

    if (firstRun) {
      complete.call(this)
    } else if (!samePage) {
      this.config.outTransition(this.config.el, fromCtx, toCtx, complete.bind(this))

      if (this.config.outTransition.length !== 4) {
        complete.call(this)
      }
    } else if (this.$child) {
      this.$child.update(childPath || '/', {}, false, {})
    }

    function complete() {
      this.component(route.component)
      ko.tasks.runEarly()
      doInTransitionIfReady(this.config.el.getElementsByClassName('component-wrapper')[0], this.config.inTransition)

      function doInTransitionIfReady(el, transitionFn) {
        if (el.children.length > 0) {
          // two more for good measure w/ deferred updates.
          // this shit happens incredibly fast.
          transitionFn(el, fromCtx, toCtx)
        } else {
          window.requestAnimationFrame(() => doInTransitionIfReady(el, transitionFn))
        }
      }
    }

    return true
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

  static getBase(ctx) {
    let base = ''
    let p = ctx
    while (p) {
      base = p.config.base + (p.$parent ? '' : '/#!') + base
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

module.exports = Context
