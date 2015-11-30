'use strict'

const ko = require('knockout')
const Context = require('./context')
const Route = require('./route')

const clickEvent = ('undefined' !== typeof document) && document.ontouchstart
  ? 'touchstart'
  : 'click'

const location = ('undefined' !== typeof window) && (window.history.location || window.location)

class Router {
  constructor({ routes, base = '', hashbang = false }, bindingCtx) {
    const parentRouterCtx = bindingCtx.$parentContext.$router
    let dispatch = true
    if (parentRouterCtx) {
      base = parentRouterCtx.path()
      dispatch = parentRouterCtx.path() !== parentRouterCtx.canonicalPath()
    } else {
      this.isRoot = true
    }

    this.onpopstate = this.onpopstate.bind(this)
    this.onclick = this.onclick.bind(this)

    window.addEventListener('popstate', this.onpopstate, false)
    document.addEventListener(clickEvent, this.onclick, false)

    this.config = { base, hashbang }
    this.ctx = bindingCtx.$router = new Context(this.config)

    this.routes = {}
    for (const route in routes) {
      this.routes[route] = new Route(route, routes[route])
    }

    if (dispatch) {
      const url = (this.config.hashbang && ~location.hash.indexOf('#!'))
        ? location.hash.substr(2) + location.search
        : location.pathname + location.search + location.hash

      this.dispatch(url, null, false)
    }
  }

  dispatch(path, state, push) {
    if (path.indexOf(this.config.base) === 0) {
      path = path.replace(this.config.base, '')
    }

    for (const r in this.routes) {
      const route = this.routes[r]
      if (route.matches(path)) {
        this.ctx.update(route, path, state, this.isRoot && push)
        return true
      }
    }

    if (this.isRoot) {
      location.href = this.ctx.canonicalPath()
    } else {
      this.ctx.component(null)
    }

    return false
  }

  onpopstate(e) {
    this.dispatch(location.pathname + location.hash, e.state, false)
  }

  onclick(e) {
    if (1 !== which(e) || e.metaKey || e.ctrlKey || e.shiftKey) {
      return
    }

    // ensure link
    let el = e.target
    while (el && 'A' !== el.nodeName) {
      el = el.parentNode
    }
    if (!el || 'A' !== el.nodeName) {
      return
    }

    // Ignore if tag has
    // 1. "download" attribute
    // 2. rel="external" attribute
    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') {
      return
    }

    // ensure non-hash for the same path
    const link = el.getAttribute('href')
    if (!this.config.hashbang && el.pathname === location.pathname && (el.hash || '#' === link)) {
      return
    }

    // Check for mailto: in the href
    if (link && link.indexOf('mailto:') > -1) {
      return
    }

    // check target
    if (el.target) {
      return
    }

    // x-origin
    if (!sameOrigin(el.href)) {
      return
    }

    // rebuild path
    let path = el.pathname + el.search + (el.hash || '')

    // same page
    const orig = path

    if (path.indexOf(this.config.base) === 0) {
      path = path.substr(this.config.base.length)
    }

    if (this.config.hashbang) path = path.replace('#!', '')

    if (this.config.base && orig === path) return

    e.preventDefault()

    this.dispatch(path)
  }

  dispose() {
    document.removeEventListener(clickEvent, this.onclick, false)
    window.removeEventListener('popstate', this.onpopstate, false)
  }
}

module.exports = {
  createViewModel(routerParams, componentInfo) {
    return new Router(routerParams, ko.contextFor(componentInfo.element))
  }
}

function which(e) {
  e = e || window.event
  return null === e.which ? e.button : e.which
}

function sameOrigin(href) {
  let origin = location.protocol + '//' + location.hostname
  if (location.port) origin += ':' + location.port
  return (href && (0 === href.indexOf(origin)))
}
