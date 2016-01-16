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

  update(origUrl, state = false, push = true, query = false) {
    const url = origUrl
      .replace(this.config.base, '')
      .replace('/#!', '')

    const route = this.getRouteForUrl(url)
    const sameRoute = route === this.route()
    const firstRun = this.route() === ''

    if (!route) {
      if (this.isRoot) {
        return false
      } else {
        return this.$parent.update(...arguments)
      }
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
      params,
      query
    }

    if (state === false && sameRoute) {
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
      '' === canonicalPath ? this.config.base : canonicalPath)

    if (!sameRoute) {
      this.config.outTransition(this.config.el, fromCtx, toCtx, complete.bind(this))

      if (this.config.outTransition.length !== 4) {
        complete.call(this)
      }
    } else if (this.$child) {
      this.$child.update(childPath || '/', {}, false, {})
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
    if (this.$child) {
      this.$child.destroy()
      delete this.$child
    }

    this.query.dispose()
    this.state.dispose()

    depth--
  }

  reload() {
    if (this.$child) {
      this.$child.destroy()
      delete this.$child
    }

    this.query.reload()
    this.state.reload()
  }
}

module.exports = Context
