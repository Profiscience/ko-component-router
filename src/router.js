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

    Router.link(this, params)

    this.passthrough = params

    if (this.isRoot) {
      document.addEventListener(events.click, Router.onclick)
      window.addEventListener(events.popstate, Router.onpopstate)
    }

    const routes = Object.assign(this.isRoot ? Router.routes : {}, params.routes)
    this.routes = Object.entries(routes).map(([r, m]) => new Route(r, m))
    if (!this.isRoot && this.$parent.ctx.route.children) {
      this.routes.push(...this.$parent.ctx.route.children)
    }
    delete params.routes

    this.update(this.getPathFromLocation(), false)
  }

  static async update(...args) {
    return await routers[0].update(...args)
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
        return await this.$child.update(childPath, args.push)
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

    this.ctx = toCtx
    this.component(false)
    ko.tasks.runEarly()
    this.component(this.ctx.route.component)
    ko.tasks.runEarly()

    if (fromCtx) {
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
    document.removeEventListener(events.click, this.onclick, false)
    window.removeEventListener(events.popstate, this.onpopstate, false)
    Router.unlink(this)
    if (this.isRoot) {
      this.ctx.route.runBeforeDispose().then(() => this.ctx.route.runAfterDispose())
    }
  }

  static use(...fns) {
    Router.middleware.push(...fns)
  }

  static usePlugin(...fns) {
    Router.plugins.push(...fns)
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

  static link(router, params) {
    routers.push(router)
    router.depth = routers.length - 1
    router.isRoot = router.depth === 0
    router.$root = routers[0]

    if (router.isRoot) {
      if (params.base) {
        Router.config.base = params.base
        delete params.base
      }
      router.base = Router.config.base
      if (params.hashbang) {
        Router.config.hashbang = params.hashbang
        delete params.hashbang
      }
      if (Router.config.hashbang) {
        router.base += '/#!'
      }
    } else {
      const $parent = routers[router.depth - 1]
      const { ctx: { pathname }, base } = $parent
      router.$parent = $parent
      router.$parent.$child = router
      router.base = base + pathname
    }
  }

  static unlink(router) {
    routers.pop()
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
