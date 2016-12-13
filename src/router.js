import ko from 'knockout'
import Context from './context'
import Route from './route'

const events = {
  click: document.ontouchstart ? 'touchstart' : 'click',
  popstate: 'popstate'
}

const routers = []

export default class Router {
  constructor(params, el) {
    const { routes = {}, base = '', hashbang } = params

    ko.contextFor(el).$router = this

    this.config = { hashbang }
    this.element = el
    this.component = ko.observable()
    this.isNavigating = ko.observable(true)

    delete params.routes
    delete params.base
    this.passthrough = params

    Router.link(this, base)

    if (this.$parent && this.$parent.ctx.route.children) {
      Object.assign(routes, this.$parent.ctx.route.children)
    }
    this.routes = Object.keys(routes).map((r) => new Route(this, r, routes[r]))

    if (!this.$parent) {
      ko.router = this
      this.isRoot = true
      this.history = ko.observableArray([])
      document.addEventListener(events.click, Router.onclick)
      window.addEventListener(events.popstate, Router.onpopstate)
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
      if (this.$child) {
        return await this.$child.update(childPath, push)
      } else {
        return false
      }
    }

    if (this.ctx) {
      const shouldNavigate = await this.ctx.runBeforeNavigateCallbacks()
      if (shouldNavigate === false) {
        return false
      }

      this.isNavigating(true)

      await this.ctx.route.dispose()
    }

    const currentUrl = Router.canonicalizePath(location.pathname + location.search + location.hash)
    const { search, hash } = Router.parseUrl(currentUrl)

    history[push ? 'pushState' : 'replaceState'](
      history.state,
      document.title,
      this.config.base + path + search + hash
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

    this.isNavigating(false)

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
    if (this.isRoot) {
      this.ctx.route.dispose()
    }
  }

  static use(fn) {
    Route.use(fn)
  }

  static link(router, base) {
    if (routers.length === 0) {
      router.config.base = router.config.hashbang
        ? base + '/#!'
        : base
    } else {
      const $parent = routers[routers.length - 1]
      const { ctx: { pathname }, config: { base } } = $parent
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
    if (!router.isRoot) {
      delete router.$parent.$child
    }
  }

  static onclick(e) {
    if (e.defaultPrevented || e.target.dataset.external) {
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

    const { pathname, search, hash = '' } = el
    const path = (pathname + search + hash).replace(new RegExp(ko.router.config.base, 'i'), '')

    if (
      isCrossOrigin ||
        isDoubleClick ||
        isDownload ||
        isEmptyHash ||
        isMailto ||
        hasExternalRel ||
        hasModifier ||
        hasOtherTarget) {
      return
    }

    ko.router.update(path)
      .then((navigated) => {
        if (!navigated) {
          e.target.dataset.external = true
          e.target.dispatchEvent(e)
        }
      })

    e.preventDefault()
  }

  static onpopstate(e) {
    ko.router.update(ko.router.getPathFromLocation(), false)
    e.preventDefault()
  }

  static canonicalizePath(path) {
    return path.replace(new RegExp('/?#?!?/?'), '/')
  }

  static parseUrl(url) {
    const parser = document.createElement('a')
    const b = ko.router.config.base.toLowerCase()
    if (b && url.toLowerCase().indexOf(b) === 0) {
      url = url.replace(new RegExp(b, 'i'), '') || '/'
    }
    parser.href = Router.canonicalizePath(url)
    return parser
  }

  static getPath(url) {
    return Router.parseUrl(url).pathname
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
