import ko from 'knockout'
import Context from './context'
import Route from './route'

const events = {
  click: document && document.ontouchstart
    /* istanbul ignore next */
    ? 'touchstart'
    : 'click',
  popstate: 'popstate'
}

const routers = []

export default class Router {
  constructor(params, el) {
    const bindingCtx = ko.contextFor(el)
    bindingCtx.$router = this
    this.bindingCtx = bindingCtx

    const { routes, base = '', hashbang } = params

    this.config = { hashbang }

    this.element = el

    delete params.routes
    delete params.base
    this.passthrough = params

    this.component = ko.observable()

    Router.link(this, base)

    this.routes = Object.keys(routes).map((r) => new Route(this, r, routes[r]))

    if (!this.$parent) {
      this.history = ko.observableArray([])
    }

    this.onclick = Router.onclick.bind(this)
    this.onpopstate = Router.onpopstate.bind(this)

    document.addEventListener(events.click, this.onclick)
    if (!this.$parent) {
      window.addEventListener(events.popstate, this.onpopstate)
    }

    this.update(this.getPathFromLocation(), false)
  }

  async update(url, push = true) {
    const path = Router.getPath(url)
    const route = this.resolvePath(path)

    if (!route) {
      return false
    }

    const [params, pathname, childPath] = route.parse(path)

    if (this.ctx && this.ctx.pathname === pathname) {
      return this.$child && await this.$child.update(childPath, push)
    }

    if (this.ctx) {
      const shouldNavigate = await this.ctx.runBeforeNavigateCallbacks()
      if (shouldNavigate === false) {
        return false
      }

      await this.ctx.route.dispose()
    }

    history[push ? 'pushState' : 'replaceState'](
      history.state,
      document.title,
      this.config.base + path
    )

    this.ctx = new Context({
      router: this,
      params,
      route,
      path,
      pathname,
      passthrough: this.passthrough
    })

    await route.run(this.ctx)

    return true
  }

  resolvePath(path) {
    let matchingRouteWithFewestDynamicSegments
    let fewestMatchingSegments = Infinity

    for (const rn in this.routes) {
      const r = this.routes[rn]
      if (r.matches(path)) {
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

  getPathFromLocation() {
    return Router
      .canonicalizePath(location.pathname + location.search + location.hash)
      .replace(new RegExp(this.config.base, 'i'), '')
  }

  dispose() {
    document.removeEventListener(events.click, this.onclick, false)
    window.removeEventListener(events.popstate, this.onpopstate, false)
    Router.unlink(this)
  }

  static use(fn) {
    Route.use(fn)
  }

  static link(router, base) {
    if (routers.length === 0) {
      ko.router = router
      router.config.base = router.config.hashbang
        ? base + '/#!'
        : base
    } else {
      const $parent = routers[routers.length - 1]
      const { ctx: { route, path } } = $parent
      const [, pathname] = route.parse(path)
      router.$parent = $parent
      router.$parent.$child = router
      router.config.base = base + pathname
    }

    routers.push(router)
    router.depth = routers.length
  }

  static unlink(router) {
    routers.pop()
    if (routers.length === 0) {
      ko.router = Router
    }
    if (router.$parent) {
      delete router.$parent.$child
    }
  }

  static onclick(e) {
    if (e.defaultPrevented) {
      return
    }

    let el = e.target
    while (el && 'A' !== el.nodeName) {
      el = el.parentNode
    }
    if (!el || 'A' !== el.nodeName) {
      return
    }

    const isCrossOrigin = !Router.sameOrigin(el.href)
    const isDoubleClick = 1 !== Router.which(e)
    const isDownload = el.hasAttribute('download')
    const isEmptyHash = el.getAttribute('href') === '#'
    const isMailto = (el.getAttribute('href') || '').indexOf('mailto:') === 0
    const hasExternalRel = el.getAttribute('rel') === 'external'
    const hasModifier = e.metaKey || e.ctrlKey || e.shiftKey
    const hasOtherTarget = el.hasAttribute('target')

    if (isCrossOrigin ||
        isDoubleClick ||
        isDownload ||
        isEmptyHash ||
        isMailto ||
        hasExternalRel ||
        hasModifier ||
        hasOtherTarget) {
      return
    }

    const { pathname, search, hash = '' } = el
    const path = pathname + search + hash

    if (this.update(path)) {
      e.preventDefault()
    }
  }

  static onpopstate(e) {
    if (e.defaultPrevented) {
      return
    }

    if (this.update(this.getPathFromLocation(), false)) {
      e.preventDefault()
    }
  }

  static canonicalizePath(path) {
    return path.replace(new RegExp('/?#?!?/?'), '/')
  }

  static getPath(url) {
    const parser = document.createElement('a')
    const b = ko.router.config.base
    if (b && url.indexOf(b)) {
      url = url.split(b)[1]
    }
    parser.href = Router.canonicalizePath(url)
    return parser.pathname
  }

  static sameOrigin(href) {
    const { hostname, port, protocol } = location
    let origin = protocol + '//' + hostname
    if (port) {
      origin += ':' + port
    }
    return href && href.indexOf(origin) === 0
  }

  static which(e) {
    e = e || window.event
    return null === e.which ? e.button : e.which
  }
}
