import ko from 'knockout'
import Context from './context'
import Route, { RouteConfig } from './route'
import {
  AsyncCallback,
  isBoolean, isPlainObject, isUndefined,
  castArray,
  extend, extendWith,
  flatMap, map, mapValues,
  reduce,
  traversePath
} from './utils'

/* eslint-disable */
export interface Middleware {
  (ctx: Context, done?: () => any): {
    beforeRender?:  AsyncCallback
    afterRender?:   AsyncCallback
    beforeDispose?: AsyncCallback
    afterDispose?:  AsyncCallback
  }
}

export interface Plugin {
  (routeConfig: any): RouteConfig
}

export interface RouteMap {
  [name: string]: Array<RouteConfig>
}
/* eslint-enable */

export default class Router {
  /* eslint-disable */
  private static routes: RouteMap = {}
  private static events: {
    click: string,
    popstate: string
  } = {
    click:  document.ontouchstart ? 'touchstart' : 'click',
    popstate: 'popstate'
  }

  static head:        Router
  static onInit:      Array<Function>     = []
  static middleware:  Array<Middleware>   = []
  static plugins:     Array<Plugin>       = []
  static config: {
    base?:                string
    hashbang?:            boolean
    activePathCSSClass?:  string
  } = {
    base:               '',
    hashbang:           false,
    activePathCSSClass: 'active-path'
  }

  onInit:         Array<Function> = []
  component:      KnockoutObservable<string>
  isNavigating:   KnockoutObservable<boolean>
  routes:         Array<Route>
  isRoot:         boolean
  ctx:            Context
  bound:          boolean
  /* eslint-enable */

  constructor(
    url: string,
    $parentCtx?: Context,
    _with: { [k: string]: any } = {}
  ) {
    this.component = ko.observable(null)
    this.isNavigating = ko.observable(true)
    this.isRoot = isUndefined($parentCtx)
    this.routes = this.isRoot
      ? Router.createRoutes(Router.routes)
      : $parentCtx.route.children

    if (this.isRoot) {
      Router.head = this
      document.addEventListener(Router.events.click, Router.onclick)
      window.addEventListener(Router.events.popstate, Router.onpopstate)
    }

    this.ctx = new Context(this, $parentCtx, Router.getPath(url), _with)
  }

  get initialized(): Promise<Router> {
    if (this.isNavigating()) {
      return new Promise((resolve) => this.onInit.push(resolve))
    } else {
      return Promise.resolve(this)
    }
  }

  init() {
    this.isNavigating(false)
    this.ctx.runAfterRender().then(() => {
      const resolveRouter = (router) => (resolve) => resolve(router)
      let ctx = this.ctx
      while (ctx) {
        map(ctx.router.onInit, resolveRouter(ctx.router))
        ctx = ctx.$child
      }
    })
  }

  async update(
    url: string,
    _args?: boolean | {
      push?: boolean
      force?: boolean
      with?: { [prop: string]: any }
    }): Promise<boolean> {
    let args
    if (isBoolean(_args)) {
      args = { push: _args as boolean }
    } else if (isUndefined(_args)) {
      args = {}
    } else {
      args = _args
    }
    if (isUndefined(args.push)) {
      args.push = true
    }
    if (isUndefined(args.with)) {
      args.with = {}
    }

    const fromCtx = this.ctx
    const { search, hash } = Router.parseUrl(url)
    const path = Router.getPath(url)
    const route = this.resolveRoute(path)
    const [, pathname, childPath] = route.parse(path)
    const samePage = fromCtx.pathname === pathname

    if (fromCtx.$child && samePage && !args.force) {
      return await fromCtx.$child.router.update(childPath + search + hash, args)
    }

    const toCtx = new Context(this, this.ctx.$parent, path, args.with)

    if (!toCtx.route) {
      return false
    }

    const shouldNavigate = await fromCtx.runBeforeNavigateCallbacks()
    if (shouldNavigate === false) {
      return false
    }

    this.isNavigating(true)

    await fromCtx.runBeforeDispose()

    history[args.push ? 'pushState' : 'replaceState'](
      history.state,
      document.title,
      toCtx.base + toCtx.path + search + hash
    )

    await toCtx.runBeforeRender()

    if (isUndefined(toCtx._redirect)) {
      this.component(null)
      ko.tasks.runEarly()
    }

    this.ctx = toCtx

    await fromCtx.runAfterDispose()

    toCtx.render()

    if (!isUndefined(toCtx._redirect)) {
      await toCtx.runAfterRender()
      const { router: r, path: p } = traversePath(toCtx.router, toCtx._redirect)
      r.update(p, toCtx._redirectArgs)
    }

    return true
  }

  resolveRoute(path: string): Route {
    let matchingRouteWithFewestDynamicSegments
    let fewestMatchingSegments = Infinity

    for (const rn in this.routes) {
	  if (this.routes.hasOwnProperty(rn)) {
		  const r = this.routes[rn]
		  if (r.matches(path)) {
			if (r.keys.length === 0) {
			  return r
			} else if (fewestMatchingSegments === Infinity ||
			  (r.keys.length < fewestMatchingSegments && r.keys[0].pattern !== '.*')) {
			  fewestMatchingSegments = r.keys.length
			  matchingRouteWithFewestDynamicSegments = r
			}
		  }
		}
	}
    return matchingRouteWithFewestDynamicSegments
  }

  dispose() {
    if (this.isRoot) {
      document.removeEventListener(Router.events.click, Router.onclick, false)
      window.removeEventListener(Router.events.popstate, Router.onpopstate, false)
      delete Router.head // eslint-disable-line
      // this.ctx.runBeforeDispose().then(() => this.ctx.runAfterDispose())
    }
  }

  static get initialized(): Promise<Router> {
    if (Router.head) {
      return Promise.resolve(Router.head)
    } else {
      return new Promise((resolve) => this.onInit.push(resolve))
    }
  }

  static get base(): string {
    return Router.config.base + (Router.config.hashbang ? '/#!' : '')
  }

  static setConfig({ base, hashbang, activePathCSSClass }: {
    base?: string
    hashbang?: boolean
    activePathCSSClass?: string
  }) {
    extendWith(Router.config, {
      base,
      hashbang,
      activePathCSSClass
    }, (_default, v) => isUndefined(v) ? _default : v)
  }

  static use(...fns: Array<Middleware>) {
    Router.middleware.push(...fns)
  }

  static usePlugin(...fns: Array<Plugin>) {
    Router.plugins.push(...fns)
  }

  static useRoutes(routes: { [route: string]: any }) {
    extend(Router.routes, Router.normalizeRoutes(routes))
  }

  static get(i: number): Router {
    let router = Router.head
    while (i-- > 0) {
      router = router.ctx.$child.router
    }
    return router
  }

  static async update(
    url: string,
    _args?: boolean | {
      push?: boolean
      force?: boolean
      with?: { [prop: string]: any }
    }): Promise<boolean> {
    return await Router.head.update(url, _args)
  }

  static getPathFromLocation(): string {
    const path = location.pathname + location.search + location.hash
    const baseWithOrWithoutHashbangRegexp = Router.config.base.replace('#!', '#?!?')
    return path.replace(new RegExp(baseWithOrWithoutHashbangRegexp, 'i'), '')
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
    const path = (pathname + search + hash).replace(new RegExp(Router.base, 'i'), '')

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
    Router.update(Router.getPathFromLocation(), false)
    e.preventDefault()
  }

  private static canonicalizePath(path) {
    return path.replace(new RegExp('/?#?!?/?'), '/')
  }

  private static parseUrl(url: string) {
    const parser = document.createElement('a')
    const b = Router.base.toLowerCase()
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

  private static createRoutes(routes: RouteMap): Array<Route> {
    return map(routes, (config, path) => new Route(path, config))
  }

  private static normalizeRoutes(routes: { [route: string]: any }): RouteMap {
    return mapValues(routes, (c) =>
      map(Router.runPlugins(c), (routeConfig) =>
        isPlainObject(routeConfig)
          ? Router.normalizeRoutes(routeConfig as RouteMap) // eslint-disable-line
          : routeConfig))
  }

  private static runPlugins(config): Array<RouteConfig> {
    return flatMap(castArray(config), (rc) => {
      const routeConfig = reduce(
        Router.plugins,
        (accum, plugin: Plugin) => {
          const prc = plugin(rc)
          return isUndefined(prc) ? accum : accum.concat(castArray<RouteConfig>(prc))
        }
        , []
      )
      return routeConfig.length > 0
        ? routeConfig
        : rc
    })
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
