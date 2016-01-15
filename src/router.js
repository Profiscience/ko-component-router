'use strict'

const ko = require('knockout')
const Context = require('./context')
const Route = require('./route')

const clickEvent = ('undefined' !== typeof document) && document.ontouchstart
  ? 'touchstart'
  : 'click'

class Router {
  constructor(el, bindingCtx, {
    routes,
    base = '',
    hashbang = false,
    inTransition = noop,
    outTransition = noop
  }) {
    const parentRouterCtx = (bindingCtx.$parentContext && bindingCtx.$parentContext.$router)
    let dispatch = true
    if (parentRouterCtx) {
      base = parentRouterCtx.config.base + (parentRouterCtx.config.hashbang ? '/#!' : '') + parentRouterCtx.pathname()
      dispatch = parentRouterCtx.path() !== parentRouterCtx.canonicalPath()
      this.isRoot = false
    } else {
      this.isRoot = true
    }

    this.onpopstate = this.onpopstate.bind(this)
    this.onclick = this.onclick.bind(this)

    window.addEventListener('popstate', this.onpopstate, false)
    document.addEventListener(clickEvent, this.onclick, false)

    for (const route in routes) {
      routes[route] = new Route(route, routes[route])
    }

    this.config = { el, base, hashbang, routes, inTransition, outTransition }
    this.ctx = bindingCtx.$router = new Context(this.config)

    if (parentRouterCtx) {
      parentRouterCtx.config.childContext = this.ctx
    }

    if (dispatch) {
      const url = (this.config.hashbang && ~location.hash.indexOf('#!'))
        ? location.hash.substr(2) + location.search
        : location.pathname + location.search + location.hash

      this.dispatch(url)
    }
  }

  dispatch(path, state) {
    if (path.indexOf(this.config.base) === 0) {
      path = path.replace(this.config.base, '')
    }

    if (this.ctx.update(path, state, false, false)) {
      return true
    }

    if (this.isRoot) {
      location.href = this.ctx.canonicalPath()
    } else {
      this.ctx.component(null)
    }

    return false
  }

  onpopstate({ state }) {
    const guid = this.ctx.config.depth + this.ctx.pathname()
    this.dispatch(location.pathname + location.search + location.hash, (state || {})[guid])
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

    const isDownload = el.hasAttribute('download')
    const hasOtherTarget = el.hasAttribute('target')
    const hasExternalRel = el.getAttribute('rel') === 'external'
    const isMailto = ~(el.getAttribute('href') || '').indexOf('mailto:')
    const isCrossOrigin = !sameOrigin(el.href)
    const isEmptyHash = el.getAttribute('href') === '#'

    if (isDownload || hasOtherTarget || hasExternalRel || isMailto || isCrossOrigin || isEmptyHash) {
      return
    }

    // rebuild path
    let path = el.pathname + el.search + (el.hash || '')

    // same page
    const orig = path
    const base = this.config.base.replace('/#!', '')
    if (path.indexOf(base) === 0) {
      path = path.substr(base.length)
    }

    if (this.config.hashbang) {
      path = path.replace('#!', '')
    }

    if (this.config.base && orig === path) {
      return
    }

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
    const el = componentInfo.element
    const bindingCtx = ko.contextFor(el)
    return new Router(el, bindingCtx, ko.toJS(routerParams))
  }
}

function which(e) {
  e = e || window.event
  return null === e.which ? e.button : e.which
}

function noop() {}

function sameOrigin(href) {
  let origin = location.protocol + '//' + location.hostname
  if (location.port) origin += ':' + location.port
  return (href && (0 === href.indexOf(origin)))
}
