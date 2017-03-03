import * as ko from 'knockout'
import Context from './context'
import Route from './route'
import { isBool, isUndefined } from './utils'

const events = {
  click: document.ontouchstart ? 'touchstart' : 'click',
  popstate: 'popstate'
}

const onInit: Array<Function> = []
const routers: Array<Router> = []

export interface Middleware {
  (ctx: Context, done?: () => any): {
    beforeRender?:  (done?: () => any) => Promise<any>
    afterRender?:   (done?: () => any) => Promise<any>
    beforeDispose?: (done?: () => any) => Promise<any>
    afterDispose?:  (done?: () => any) => Promise<any>
  }
}

export interface Plugin {
  (routeConfig: any): Routes
}

export interface Routes {
  [name: string]: string | Middleware | Routes | Array<string|Middleware|Routes>
}

class Router {
  static config: {
    base?:                string
    hashbang?:            boolean
    activePathCSSClass?:  string
  } = {
    base:               '',
    hashbang:           false,
    activePathCSSClass: 'active-path'
  }

  static middleware:  Array<Middleware>
  static plugins:     Array<Plugin>
  static routes:      Routes

  component:      KnockoutObservable<string>
  isNavigating:   KnockoutObservable<boolean>
  routes:         Array<Route>
  isRoot:         boolean
  passthrough:    Object
  depth:          number
  ctx:            Context

  constructor() {
    this.component = ko.observable(null)
    this.isNavigating = ko.observable(true)

    Router.link(this)

    if (this.isRoot) {
      this.routes = Route.createRoutes(Router.routes)
      document.addEventListener(events.click, Router.onclick)
      window.addEventListener(events.popstate, Router.onpopstate)
    } else if (this.$parent.ctx.route.children) {
      this.routes = this.$parent.ctx.route.children
    }

    this.update(this.getPathFromLocation(), false).then(() => onInit.forEach((r) => r(this)))
  }

  get base(): string {
    return this.isRoot
      ? Router.config.base + (Router.config.hashbang ? '/#!' : '')
      : this.$parent.base + this.$parent.ctx.pathname
  }

  get $root(): Router {
    return routers[0]
  }

  get $parent(): Router {
    return routers[this.depth - 1]
  }

  get $parents(): Array<Router> {
    return routers.slice(0, this.depth).reverse()
  }

  get $child(): Router {
    return routers[this.depth + 1]
  }

  get $children(): Array<Router> {
    return routers.slice(this.depth + 1)
  }

  async update(
    url: string,
    _args?: boolean | {
      push?:  boolean
      force?: boolean
      with?:  Object
    }): Promise<boolean> {

    const fromCtx = this.ctx
    let args

    if (isBool(args)) {
      args = { push: _args as boolean }
    } else if (isUndefined(args)) {
      args = {}
    }
    if (isUndefined(args.push)) {
      args.push = true
    }
    if (isUndefined(args.with)) {
      args.with = {}
    }

    const { search, hash } = Router.parseUrl(url)
    const path = Router.getPath(url)
    const route = this.resolveRoute(path)

    if (!route) {
      return false
    }

    const [params, pathname, childPath] = route.parse(path)

    if (fromCtx && fromCtx.pathname === pathname && !args.force) {
      if (this.$child) {
        return await this.$child.update(childPath + search + hash, args)
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
      await fromCtx.runBeforeDispose()
    }

    // $children will become unaccessible after the component is torn down
    // so a reference must be saved
    const fromCtxChildren = fromCtx && fromCtx.$children.reverse()

    await toCtx.runBeforeRender()

    this.ctx = toCtx
    this.component(null)
    ko.tasks.runEarly()
    this.component(this.ctx.route.component)
    ko.tasks.runEarly()

    if (fromCtx) {
      for (const fromCtxChild of fromCtxChildren) {
        await fromCtxChild.runAfterDispose()
      }
      await fromCtx.runAfterDispose()
    }

    await toCtx.runAfterRender()

    this.isNavigating(false)

    return true
  }

  private resolveRoute(path: string): Route {
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

  private getPathFromLocation(): string {
    const path = location.pathname + location.search + location.hash
    const baseWithOrWithoutHashbangRegexp = this.base.replace('#!', '#?!?')
    return path.replace(new RegExp(baseWithOrWithoutHashbangRegexp, 'i'), '')
  }

  dispose() {
    Router.unlink()
    if (this.isRoot) {
      document.removeEventListener(events.click, Router.onclick, false)
      window.removeEventListener(events.popstate, Router.onpopstate, false)
      this.ctx.runBeforeDispose().then(() => this.ctx.runAfterDispose())
    }
  }

  static setConfig({ base, hashbang, activePathCSSClass }: {
    base?:                string
    hashbang?:            boolean
    activePathCSSClass?:  string
  }) {
    if (base) {
      Router.config.base = base
    }
    if (hashbang) {
      Router.config.hashbang = hashbang
    }
    if (activePathCSSClass) {
      Router.config.activePathCSSClass = activePathCSSClass
    }
  }

  static use(...fns: Array<Middleware>) {
    Router.middleware.push(...fns)
  }

  static usePlugin(...fns: Array<Plugin>) {
    Router.plugins.push(...fns)
  }

  static useRoutes(routes: { [route: string]: any }) {
    Object.assign(Router.routes, routes)
  }

  static get(i: number): Router {
    return routers[i]
  }

  static get head(): Router {
    return routers[0]
  }

  static get tail(): Router {
    return routers[routers.length - 1]
  }

  static get initialized(): Promise<Router> {
    if (routers.length === 0) {
      return new Promise((resolve) => onInit.push(resolve))
    } else {
      return Promise.resolve(Router.head)
    }
  }

  static async update(
    url: string,
    _args?: boolean | {
      push?:  boolean
      force?: boolean
      with?:  Object
    }): Promise<boolean> {
    return await routers[0].update(url, _args)
  }

  private static link(router) {
    router.depth = routers.length
    router.isRoot = router.depth === 0
    routers.push(router)
  }

  private static unlink() {
    routers.pop()
  }

  private static onclick(e) {
    if (e.defaultPrevented) {
      return
    }

    let el = e.target
    while (el && el.nodeName !== 'A') {
      el = el.parentNode
    }
    if (!el || el.nodeName !== 'A') {
      return
    }

    const { pathname, search, hash = '' } = el
    const path = (pathname + search + hash).replace(new RegExp(routers[0].base, 'i'), '')

    const isValidRoute = Router.hasRoute(path)
    const isCrossOrigin = !Router.sameOrigin(el.href)
    const isDoubleClick = Router.which(e) !== 1
    const isDownload = el.hasAttribute('download')
    const isEmptyHash = el.getAttribute('href') === '#'
    const isMailto = (el.getAttribute('href') || '').indexOf('mailto:') === 0
    const hasExternalRel = el.getAttribute('rel') === 'external'
    const hasModifier = e.metaKey || e.ctrlKey || e.shiftKey
    const hasOtherTarget = el.hasAttribute('target')

    if (!isValidRoute ||
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
    e.preventDefault()
  }

  private static onpopstate(e) {
    Router.update(routers[0].getPathFromLocation(), false)
    e.preventDefault()
  }

  private static canonicalizePath(path) {
    return path.replace(new RegExp('/?#?!?/?'), '/')
  }

  private static parseUrl(url) {
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

  private static getPath(url) {
    return Router.parseUrl(url).pathname
  }

  private static hasRoute(path) {
    return !isUndefined(Router.head.resolveRoute(Router.getPath(path)))
  }

  private static sameOrigin(href) {
    const { hostname, port, protocol } = location
    let origin = protocol + '//' + hostname
    if (port) {
      origin += ':' + port
    }
    return href && href.indexOf(origin) === 0
  }

  private static which(e): number {
    e = e || window.event
    return e.which === null ? e.button : e.which
  }
}

export default Router
