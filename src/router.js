import ko from 'knockout'
import Context from './context'
import Route from './route'
import { isBool, isUndefined } from './utils'

const events = {
  click: document.ontouchstart ? 'touchstart' : 'click',
  popstate: 'popstate'
}

const routers = []

class Router {
  constructor(params) {
    this.component = ko.observable()
    this.isNavigating = ko.observable(true)
    this.routes = Route.createRoutes(params.routes || {})

    Router.link(this)

    if (this.isRoot) {
      Router.setConfig(params)
      this.routes.push(...Route.createRoutes(Router.routes))
      document.addEventListener(events.click, Router.onclick)
      window.addEventListener(events.popstate, Router.onpopstate)
    } else if (this.$parent.ctx.route.children) {
      this.routes.push(...this.$parent.ctx.route.children)
    }

    this.passthrough = Object.entries(params).reduce((accum, [k, v]) =>
      k === 'base' || k === 'hashbang' || k === 'routes'
        ? accum
        : Object.assign(accum, { [k]: v }),
      {})

    this.update(this.getPathFromLocation(), false)
  }

  get base() {
    return this.isRoot
      ? (Router.config.hashbang ? '/#!' : '') + Router.config.base
      : this.$parent.base + this.$parent.ctx.pathname
  }

  get $parent() {
    return routers[this.depth - 1]
  }

  get $child() {
    return routers[this.depth + 1]
  }

  async update(url, args) {
    const fromCtx = this.ctx

    if (isBool(args)) {
      args = { push: args }
    } else if (isUndefined(args)) {
      args = {}
    }
    if (isUndefined(args.push)) {
      args.push = true
    }
    if (isUndefined(args.with)) {
      args.with = {}
    }

    const path = Router.getPath(url)
    const route = this.resolvePath(path)

    if (!route) {
      return false
    }

    const [params, pathname, childPath] = route.parse(path)

    if (fromCtx && fromCtx.pathname === pathname && !args.force) {
      if (this.$child) {
        return await this.$child.update(childPath, args)
      } else {
        return false
      }
    }

    if (fromCtx) {
      const shouldNavigate = await fromCtx.runBeforeNavigateCallbacks()
      if (shouldNavigate === false) {
        return false
      }

      this.isNavigating(true)
    }

    const currentUrl = Router.canonicalizePath(location.pathname + location.search + location.hash)
    const { search, hash } = Router.parseUrl(currentUrl)

    history[args.push ? 'pushState' : 'replaceState'](
      history.state,
      document.title,
      this.base + path + search + hash
    )

    const toCtx = new Context(Object.assign({}, args.with, this.passthrough, {
      router: this,
      params,
      route,
      path,
      pathname
    }))

    if (fromCtx) {
      await fromCtx.route.runBeforeDispose()
    }

    await toCtx.route.runBeforeRender(toCtx)

    const fromCtxChildRoute = fromCtx && fromCtx.$child && fromCtx.$child.route

    this.ctx = toCtx
    this.component(false)
    ko.tasks.runEarly()
    this.component(this.ctx.route.component)
    ko.tasks.runEarly()

    if (fromCtx) {
      if (fromCtxChildRoute) {
        await fromCtxChildRoute.runAfterDispose()
      }
      await fromCtx.route.runAfterDispose()
    }
    await toCtx.route.runAfterRender()

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
    const path = location.pathname + location.search + location.hash
    return path.replace(new RegExp(this.base, 'i'), '')
  }

  dispose() {
    Router.unlink()
    if (this.isRoot) {
      document.removeEventListener(events.click, Router.onclick, false)
      window.removeEventListener(events.popstate, Router.onpopstate, false)
      this.ctx.route.runBeforeDispose().then(() => this.ctx.route.runAfterDispose())
    }
  }

  static setConfig({ base, hashbang }) {
    if (base) {
      Router.config.base = base
    }
    if (hashbang) {
      Router.config.hashbang = hashbang
    }
  }

  static use(...fns) {
    Router.middleware.push(...fns)
  }

  static usePlugin(...fns) {
    Router.plugins.push(...fns)
  }

  static useRoutes(routes) {
    Object.assign(Router.routes, routes)
  }

  static get(i) {
    return routers[i]
  }

  static get head() {
    return routers[0]
  }

  static get tail() {
    return routers[routers.length - 1]
  }

  static async update(...args) {
    return await routers[0].update(...args)
  }

  static link(router) {
    router.depth = routers.length
    router.isRoot = router.depth === 0
    routers.push(router)
    router.$root = routers[0]
  }

  static unlink() {
    routers.pop()
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
    const path = (pathname + search + hash).replace(new RegExp(routers[0].base, 'i'), '')

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

    Router.update(path)
      .then((navigated) => {
        if (!navigated) {
          e.target.dataset.external = true
          e.target.dispatchEvent(new e.constructor(e.type, e))
        }
      })

    e.preventDefault()
  }

  static onpopstate(e) {
    Router.update(routers[0].getPathFromLocation(), false)
    e.preventDefault()
  }

  static canonicalizePath(path) {
    return path.replace(new RegExp('/?#?!?/?'), '/')
  }

  static parseUrl(url) {
    const parser = document.createElement('a')
    const b = routers[0].base.toLowerCase()
    if (b && url.toLowerCase().indexOf(b) === 0) {
      url = url.replace(new RegExp(b, 'i'), '') || '/'
    }
    parser.href = Router.canonicalizePath(url)
    return {
      hash: parser.hash,
      pathname: (parser.pathname.charAt(0) === '/')
        ? parser.pathname
        : '/' + parser.pathname,
      search: parser.search
    }
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

Router.config = { base: '', hashbang: false }
Router.middleware = []
Router.plugins = []
Router.routes = {}

export default Router
