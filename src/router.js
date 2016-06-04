import ko from 'knockout'
import Context from './context'
import Route from './route'
import { isUndefined } from './utils'

const clickEvent = (!isUndefined(document)) && document.ontouchstart
  ? 'touchstart'
  : 'click'

class Router {
  constructor(el, bindingCtx, {
    routes,
    base = '',
    hashbang = false,
    inTransition = noop,
    outTransition = noop,
    persistState = false,
    persistQuery = false
  }) {
    for (const route in routes) {
      routes[route] = new Route(route, routes[route])
    }

    this.config = {
      el,
      base,
      hashbang,
      routes,
      inTransition,
      outTransition,
      persistState,
      persistQuery
    }

    this.ctx = new Context(bindingCtx, this.config)

    this.onpopstate = this.onpopstate.bind(this)
    this.onclick = this.onclick.bind(this)
    window.addEventListener('popstate', this.onpopstate, false)
    document.addEventListener(clickEvent, this.onclick, false)

    let dispatch = true
    if (this.ctx.$parent) {
      dispatch = this.ctx.$parent.path() !== this.ctx.$parent.canonicalPath()
    }

    if (dispatch) {
      const path = (this.config.hashbang && ~location.hash.indexOf('#!'))
        ? location.hash.substr(2) + location.search
        : location.pathname + location.search + location.hash

      this.dispatch({ path })
    }
  }

  dispatch({ path, state, pushState = false }) {
    if (path.toLowerCase().indexOf(this.config.base.toLowerCase()) === 0) {
      path = path.substr(this.config.base.length) || '/'
    }

    return this.ctx.update(path, state, pushState, false)
  }

  onpopstate({ state }) {
    this.dispatch({
      path: location.pathname + location.search + location.hash,
      state: (state || {})[this.ctx.config.depth + this.ctx.pathname()]
    })
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
    if (path.toLowerCase().indexOf(base.toLowerCase()) === 0) {
      path = path.substr(base.length)
    }

    if (this.config.hashbang) {
      path = path.replace('/#!', '')
    }

    if (this.config.base && orig === path) {
      return
    }

    if (this.dispatch({ path, pushState: true })) {
      e.preventDefault()
    }
  }

  dispose() {
    document.removeEventListener(clickEvent, this.onclick, false)
    window.removeEventListener('popstate', this.onpopstate, false)
    this.ctx.destroy()
  }
}

function createViewModel(routerParams, componentInfo) {
  const el = componentInfo.element
  const bindingCtx = ko.contextFor(el)
  return new Router(el, bindingCtx, ko.toJS(routerParams))
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

export default { createViewModel }
