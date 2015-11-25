'use strict'

const ko = require('knockout')
const Context = require('./context')
const Route = require('./route')

const clickEvent = ('undefined' !== typeof document) && document.ontouchstart
  ? 'touchstart'
  : 'click'

const location = ('undefined' !== typeof window) && (window.history.location || window.location)

class Router {
  constructor({ routes, base ='', hashbang = false }, bindingCtx) {
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

    this.hashbang = hashbang
    this.base = base
    this.callbacks = []
    this.routes = {}
    this.component = ko.observable()
    this.ctx = new Context({
      hashbang: this.hashbang,
      base: this.base
    })

    const url = (this.hashbang && ~location.hash.indexOf('#!'))
      ? location.hash.substr(2) + location.search
      : location.pathname + location.search + location.hash

    this.ctx.update(url)
    bindingCtx.$router = this.ctx

    for (const route in routes) {
      this.route(route, routes[route])
    }

    if (dispatch) {
      this.replace(url, null)
    }
  }

  route(path, args) {
    let stack

    if (path[path.length - 1] === '!') {
      path = path.replace('!', ':child_path(.*)?')
    }

    if (typeof args === 'string') {
      stack = [args]
    } else {
      stack = args
    }

    for (let i = 0; i < stack.length; i++) {
      const handler = stack[i]
      if (typeof handler === 'string') {
        stack[i] = ((component) => (ctx, next) => {
          const self = this
          const paramSubs = []

          this.component(component)

          for (const paramName in ctx.params) {
            const param = ctx.params[paramName]
            paramSubs.push(param.subscribe(() => {
              const url = ctx.route().compile(ko.toJS(ctx.params))
              self.show(url)
            }))
          }

          const killMe = this.component.subscribe(() => {
            killMe.dispose()
            for (const sub of paramSubs) {
              sub.dispose()
            }
          })

          next(true)
        })(handler)
      }
    }

    const r = new Route(path, this.ctx)
    r.match() // fucking sloppy side-effects...
    this.routes[path] = r

    for (const fn of stack) {
      this.callbacks.push(r.middleware(fn))
    }
  }

  replace(path, state) {
    this.ctx.update(path, state)
    this.dispatch()
  }

  dispatch() {
    const self = this
    let i = 0, handled = false

    function nextEnter(wasHandled) {
      const fn = self.callbacks[i++]
      handled = handled || wasHandled

      if (fn) {
        return fn(self.ctx, nextEnter) || handled
      } else if (!handled) {
        self.unhandled()
      }
    }

    return nextEnter()
  }

  unhandled() {
    if (this.isRoot) {
      location.href = this.ctx.canonicalPath()
    } else {
      this.component(null)
    }
  }

  show(path, state = {}, push = true) {
    this.ctx.update(path, state)
    if (this.dispatch() && push) {
      this.ctx.pushState()
    }
  }

  dispose() {
    document.removeEventListener(clickEvent, this.onclick, false)
    window.removeEventListener('popstate', this.onpopstate, false)
  }

  redirect(path) {
    setTimeout(() => this.replace(path), 0)
  }

  onpopstate(e) {
    if (e.state) {
      const path = e.state.path
      this.replace(path, e.state)
    } else {
      this.show(location.pathname + location.hash, undefined, false)
    }
  }

  onclick(e) {
    if (1 !== which(e)) return
    if (e.metaKey || e.ctrlKey || e.shiftKey) return

    // ensure link
    let el = e.target
    while (el && 'A' !== el.nodeName) el = el.parentNode
    if (!el || 'A' !== el.nodeName) return

    // Ignore if tag has
    // 1. "download" attribute
    // 2. rel="external" attribute
    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return

    // ensure non-hash for the same path
    const link = el.getAttribute('href')
    if (!this.hashbang && el.pathname === location.pathname && (el.hash || '#' === link)) return

    // Check for mailto: in the href
    if (link && link.indexOf('mailto:') > -1) return

    // check target
    if (el.target) return

    // x-origin
    if (!sameOrigin(el.href)) return

    // rebuild path
    let path = el.pathname + el.search + (el.hash || '')

    // same page
    const orig = path

    if (path.indexOf(this.base) === 0) {
      path = path.substr(this.base.length)
    }

    if (this.hashbang) path = path.replace('#!', '')

    if (this.base && orig === path) return

    e.preventDefault()

    this.show(path)
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
