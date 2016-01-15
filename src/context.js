'use strict'

const ko = require('knockout')
const queryFactory = require('./query').factory
const stateFactory = require('./state').factory
const utils = require('./utils')

let depth = 0

class Context {
  constructor(config) {
    this.config = config
    this.config.depth = depth++

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

  update(origUrl, state, push = true, query = false) {
    const url = origUrl
      .replace(this.config.base, '')
      .replace('/#!', '')

    const route = this.getRouteForUrl(url)
    const sameRoute = route === this.route()
    const firstRun = this.route() === ''

    if (!route) {
      return false
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
    } else {
      this.query.updateFromString(querystring)
    }

    query = this.query.getAll(false, pathname)

    if (!sameRoute && !firstRun) {
      this.reload()
    }

    const canonicalPath = this.getCanonicalPath(pathname, childPath, hash)

    const toCtx = {
      route,
      path,
      pathname,
      canonicalPath,
      hash,
      state,
      params,
      query
    }

    utils.merge(this, toCtx, true)

    history[push ? 'pushState' : 'replaceState'](
      history.state,
      document.title,
      '' === canonicalPath ? this.config.base : canonicalPath)

    if (!sameRoute) {
      this.config.outTransition(this.config.el, fromCtx, toCtx, complete.bind(this))

      if (this.config.outTransition.length !== 4) {
        complete.call(this)
      }
    } else if (this.config.childContext) {
      this.config.childContext.update(childPath || '/', {}, false, {})
    }

    function complete() {
      this.component(route.component)
      window.requestAnimationFrame(() => this.config.inTransition(this.config.el, fromCtx, toCtx))
    }

    return true
  }

  getCanonicalPath(pathname, childPath = '', hash = '') {
    const base = this.config.base
    const hashbang = this.config.hashbang
    const querystring = this.query.getFullQueryString()

    return `${base}${hashbang ? '/#!' : ''}${pathname}${childPath}${querystring ? '?' + querystring : ''}${hash ? '#' + hash : ''}`
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
        } else if (r._keys.length < fewestMatchingSegments) {
          fewestMatchingSegments = r._keys.length
          matchingRouteWithFewestDynamicSegments = r
        }
        return r
      }
    }

    return matchingRouteWithFewestDynamicSegments
  }

  destroy() {
    if (this.config.childContext) {
      this.config.childContext.destroy()
      delete this.config.childContext
    }

    this.query.destroy()
    this.state.dispose()

    depth--
  }

  reload() {
    if (this.config.childContext) {
      this.config.childContext.destroy()
      delete this.config.childContext
    }

    this.query.destroy()
    this.state.clear()
  }
}

module.exports = Context
