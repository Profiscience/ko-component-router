import 'core-js/es7/symbol'
import * as ko from 'knockout'
import { Route } from './route'
import { Router, Middleware } from './router'
import {
  AsyncCallback,
  isThenable, isUndefined,
  concat,
  extend,
  map,
  generatorify,
  sequence
} from './utils'

export class Context {
  public $child: Context
  public $parent: Context
  public router: Router
  public route: Route
  public params: { [k: string]: any }
  public path: string
  public pathname: string
  public _redirect: string
  public _redirectArgs: {
    push?: boolean
    force?: boolean
    with?: { [prop: string]: any }
  }

  private _queue: Array<Promise<any>>  = []
  private _beforeNavigateCallbacks: AsyncCallback[] = []
  private _appMiddlewareDownstream: AsyncCallback[] = []
  private _routeMiddlewareDownstream: AsyncCallback[] = []

  constructor(router: Router, $parent: Context, path: string, _with: { [key: string]: any } = {}) {
    const route = router.resolveRoute(path)
    const [params, pathname, childPath] = route.parse(path)

    extend(this, {
      $parent,
      params,
      path,
      pathname,
      route,
      router
    }, _with)

    if ($parent) {
      $parent.$child = this
    }
    if (childPath) {
      // tslint:disable-next-line no-unused-expression
      new Router(childPath, this).ctx
    }
  }

  public addBeforeNavigateCallback(cb) {
    this._beforeNavigateCallbacks.unshift(cb)
  }

  get base(): string {
    return this.router.isRoot
      ? Router.base
      : this.$parent.base + this.$parent.pathname
  }

  // full path w/o base
  get canonicalPath() {
    return this.base.replace(new RegExp(this.$root.base, 'i'), '') + this.pathname
  }

  get $root() {
    let ctx: Context = this
    while (ctx) {
      if (ctx.$parent) {
        ctx = ctx.$parent
      } else {
        return ctx
      }
    }
  }

  get $parents(): Context[] {
    const parents = []
    let parent = this.$parent
    while (parent) {
      parents.push(parent)
      parent = parent.$parent
    }
    return parents
  }

  get $children(): Context[] {
    const children = []
    let child = this.$child
    while (child) {
      children.push(child)
      child = child.$child
    }
    return children
  }

  public queue(promise) {
    this._queue.push(promise)
  }

  public redirect(path, args = {}) {
    this._redirect = path
    this._redirectArgs = extend({}, args, { push: false })
  }

  public async runBeforeNavigateCallbacks(): Promise<boolean> {
    let ctx: Context = this
    let callbacks = []
    while (ctx) {
      callbacks = [...ctx._beforeNavigateCallbacks, ...callbacks]
      ctx = ctx.$child
    }
    const { success } = await sequence(callbacks)
    return success
  }

  public render() {
    let ctx: Context = this
    while (ctx) {
      if (isUndefined(ctx._redirect)) {
        ctx.router.component(ctx.route.component)
      }
      ctx = ctx.$child
    }
    ko.tasks.runEarly()
  }

  public async runBeforeRender(flush = true) {
    const appMiddlewareDownstream = Context.runMiddleware(Router.middleware, this)
    const routeMiddlewareDownstream = Context.runMiddleware(this.route.middleware, this)

    const { count: numAppMiddlewareRanPreRedirect } = await sequence(appMiddlewareDownstream)
    const { count: numRouteMiddlewareRanPreRedirect } = await sequence(routeMiddlewareDownstream)

    this._appMiddlewareDownstream = appMiddlewareDownstream.slice(0, numAppMiddlewareRanPreRedirect)
    this._routeMiddlewareDownstream = routeMiddlewareDownstream.slice(0, numRouteMiddlewareRanPreRedirect)

    if (this.$child && isUndefined(this._redirect)) {
      await this.$child.runBeforeRender(false)
    }
    if (flush) {
      await this.flushQueue()
    }
  }

  public async runAfterRender() {
    await sequence(concat(this._appMiddlewareDownstream, this._routeMiddlewareDownstream))
    await this.flushQueue()
  }

  public async runBeforeDispose(flush = true) {
    if (this.$child && isUndefined(this._redirect)) {
      await this.$child.runBeforeDispose(false)
    }
    await sequence(concat(this._routeMiddlewareDownstream, this._appMiddlewareDownstream))
    if (flush) {
      await this.flushQueue()
    }
  }

  public async runAfterDispose(flush = true) {
    if (this.$child && isUndefined(this._redirect)) {
      await this.$child.runAfterDispose(false)
    }
    await sequence(concat(this._routeMiddlewareDownstream, this._appMiddlewareDownstream))
    if (flush) {
      await this.flushQueue()
    }
  }

  private async flushQueue() {
    const thisQueue = Promise.all(this._queue).then(() => {
      this._queue = []
    })
    const childQueues = map(this.$children, (c) => c.flushQueue())
    await Promise.all<Promise<void>>([thisQueue, ...childQueues])
  }

  private static runMiddleware(middleware: Middleware[], ctx: Context): AsyncCallback[] {
    return map(middleware, (fn) => {
      const runner = generatorify(fn)(ctx)
      let beforeRender = true
      return async () => {
        const ret = runner.next() || {}
        if (isThenable(ret)) {
          await ret
        } else if (isThenable(ret.value)) {
          await ret.value
        }
        if (beforeRender) {
          // this should only block the sequence for the first call,
          // and allow cleanup after the redirect
          beforeRender = false
          return isUndefined(ctx._redirect)
        } else {
          return true
        }
      }
    })
  }
}
