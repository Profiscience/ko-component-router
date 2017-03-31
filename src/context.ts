import ko from 'knockout'
import Route from './Route'                               // eslint-disable-line
import Router, { Middleware } from './router'             // eslint-disable-line
import {
  AsyncCallback,                                          // eslint-disable-line
  isGenerator, isThenable, isUndefined,
  concat,
  extend,
  map,
  promisify,
  sequence,
  traversePath
} from './utils'

export default class Context {
  /* eslint-disable */
  $child: Context
  $parent: Context
  _redirect: string
  router: Router
  route: Route
  params: { [k: string]: any }
  // path including childPath
  path: string
  // path segment relevant to this context
  pathname: string

  private _queue:                      Array<Promise<any>>  = []
  private _beforeNavigateCallbacks:    Array<AsyncCallback> = []
  private _appMiddlewareDownstream:    Array<AsyncCallback> = []
  private _routeMiddlewareDownstream:  Array<AsyncCallback> = []
  /* eslint-enable */

  constructor(router: Router, $parent: Context, path: string, _with: { [key: string]: any } = {}) {
    const route = router.resolveRoute(path)
    const [params, pathname, childPath] = route.parse(path)

    extend(this, {
      $parent,
      router,
      route,
      params,
      path,
      pathname
    }, _with)

    if (childPath) {
      this.$child = new Router(childPath, this).ctx
    }
  }

  addBeforeNavigateCallback(cb) {
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

  get $parents(): Array<Context> {
    const parents = []
    let parent = this.$parent
    while (parent) {
      parents.push(parent)
      parent = parent.$parent
    }
    return parents
  }

  get $children(): Array<Context> {
    const children = []
    let child = this.$child
    while (child) {
      children.push(child)
      child = child.$child
    }
    return children
  }

  queue(promise) {
    this._queue.push(promise)
  }

  redirect(path) {
    this._redirect = path
  }

  async runBeforeNavigateCallbacks(): Promise<boolean> {
    let ctx: Context = this                               // eslint-disable-line
    let callbacks = []
    while (ctx) {
      callbacks = [...ctx._beforeNavigateCallbacks, ...callbacks]
      ctx = ctx.$child
    }
    const { success } = await sequence(callbacks)
    return success
  }

  private async flushQueue() {
    const thisQueue = Promise.all(this._queue).then(() => {
      this._queue = []
    })
    const childQueues = map(this.$children, (c) => c.flushQueue())
    await Promise.all<Promise<void>>([thisQueue, ...childQueues])
  }

  render() {
    let ctx: Context = this                               // eslint-disable-line

    while (ctx) {
      if (isUndefined(ctx._redirect)) {
        ctx.router.component(ctx.route.component)
      }
      ctx = ctx.$child
    }
    ko.tasks.runEarly()
  }

  async runBeforeRender(flush = true) {
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

  async runAfterRender() {
    await sequence(concat(this._appMiddlewareDownstream, this._routeMiddlewareDownstream))
    await this.flushQueue()
  }

  async runBeforeDispose(flush = true) {
    if (this.$child && isUndefined(this._redirect)) {
      await this.$child.runBeforeDispose(false)
    }
    await sequence(concat(this._routeMiddlewareDownstream, this._appMiddlewareDownstream))
    if (flush) {
      await this.flushQueue()
    }
  }

  async runAfterDispose(flush = true) {
    if (this.$child && isUndefined(this._redirect)) {
      await this.$child.runAfterDispose(false)
    }
    await sequence(concat(this._routeMiddlewareDownstream, this._appMiddlewareDownstream))
    if (flush) {
      await this.flushQueue()
    }
  }

  private static runMiddleware(middleware: Middleware[], ctx: Context): Array<AsyncCallback> {
    return map(middleware, (fn) => {
      const runner = Context.generatorify(fn)(ctx)
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

  // ts why u no haz async generators?? babel why ur generators so $$$?????
  private static generatorify(fn) {
    return isGenerator(fn)
      ? fn
      : function(ctx) {
        let count = 1, ret
        return {
          async next() {
            switch (count++) {
            case 1:
              ret = await promisify(fn)(ctx) || false
              return ret && ret.beforeRender
                    ? await promisify(ret.beforeRender)()
                    : ret
            case 2: return ret && await promisify(ret.afterRender)()
            case 3: return ret && await promisify(ret.beforeDispose)()
            case 4: return ret && await promisify(ret.afterDispose)()
            }
          },
        }
      }
  }

  // function generatorify(fn) {
  //   return isGenerator(fn)
  //     ? fn
  //     : async function * (...args) {
  //         const ret = await promisify(fn)(...args)
  //
  //         if (isPlainObject(ret)) {
  //           yield await promisify(ret.beforeRender)()
  //           yield await promisify(ret.afterRender)()
  //           yield await promisify(ret.beforeDispose)()
  //           yield await promisify(ret.afterDispose)()
  //         } else {
  //           yield ret
  //         }
  //       }
  // }
  }
