import { isUndefined, extend, map, reduce } from 'lodash-es'
import ko from 'knockout'
import Route from './Route'
import Router, { Middleware } from './router'
import { AsyncCallback, isGenerator, isThenable, promisify, sequence } from './utils'

export default class Context {
  router: Router
  route: Route
  params: { [k: string]: any }
  // path including childPath
  path: string
  // path segment relevant to this context
  pathname: string
  // full path w/ base
  fullPath: string
  // full path w/o base
  canonicalPath: string

  private _queue:                   Array<Promise<any>>  = []
  private _beforeNavigateCallbacks: Array<AsyncCallback> = []
  private _afterRenderCallbacks:    Array<AsyncCallback> = []
  private _beforeDisposeCallbacks:  Array<AsyncCallback> = []
  private _afterDisposeCallbacks:   Array<AsyncCallback> = []

  constructor(router: Router, path: string, _with: { [key: string]: any } = {}) {
    const route = router.resolveRoute(path)
    const [params, pathname, childPath] = route.parse(path)
    
    extend(this, {
      router,
      route,
      params,
      path,
      pathname
    }, _with)

    this.router.ctx = this        
    this.fullPath = this.router.base + this.pathname
    this.canonicalPath = this.fullPath.replace(new RegExp(Router.head.base, 'i'), '')
    
    if (childPath) {
      this.router.$child = new Router(childPath, this.router, this)
    } else {
      Router.tail = router
    }
  }

  addBeforeNavigateCallback(cb) {
    this._beforeNavigateCallbacks.unshift(cb)
  }

  get $parent() {
    return isUndefined(this.router.$parent) ? undefined : this.router.$parent.ctx
  }

  get $child() {
    return isUndefined(this.router.$child) ? undefined : this.router.$child.ctx
  }

  get $parents(): Array<Context> {
    return map(this.router.$parents, (r) => r.ctx)
  }

  get $children(): Array<Context> {
    return map(this.router.$children, (r) => r.ctx)
  }

  // get element(): Element {
  //   return document.getElementsByClassName('ko-component-router-view')[this.router.depth]
  // }

  async runBeforeNavigateCallbacks(): Promise<boolean> {
    let ctx: Context = this
    let callbacks = []
    while (ctx) {
      callbacks = [...ctx._beforeNavigateCallbacks, ...callbacks]
      ctx = ctx.$child
    }
    return await sequence(callbacks)
  }

  private queue(promise) {
    this._queue.push(promise)
  }

  private async flushQueue() {
    const thisQueue = Promise.all(this._queue).then(() => { this._queue = [] })
    const childQueues = map(this.$children, (c) => c.flushQueue())
    await Promise.all<Promise<void>>([thisQueue, ...childQueues])
  }

  render() {
    let ctx: Context = this
    while (ctx) {
      ctx.router.component(ctx.route.component)
      ctx = ctx.$child
    }
    ko.tasks.runEarly()
  }

  async runBeforeRender(flush = true) {
    const [appBeforeRender, appDownstream] = Context.runMiddleware(Router.middleware, this)

    this._afterRenderCallbacks.push(appDownstream)
    this._beforeDisposeCallbacks.push(appDownstream)
    this._afterDisposeCallbacks.push(appDownstream)

    await appBeforeRender

    const [routeBeforeRender, routeDownstream] = Context.runMiddleware(this.route.middleware, this)

    this._afterRenderCallbacks.push(routeDownstream)
    this._beforeDisposeCallbacks.unshift(routeDownstream)
    this._afterDisposeCallbacks.unshift(routeDownstream)
   
    await routeBeforeRender

    if (this.$child) {
      await this.$child.runBeforeRender(false)
    }
    if (flush) {
      await this.flushQueue()
    }
  }

  async runAfterRender(flush = true) {
    if (this.$child) {
      await this.$child.runAfterRender(false)
    }
    await sequence(this._afterRenderCallbacks)
    if (flush) {
      await this.flushQueue()
    }
  }

  async runBeforeDispose(flush = true) {
    if (this.$child) {
      await this.$child.runBeforeDispose(false)
    }
    await sequence(this._beforeDisposeCallbacks)
    if (flush) {
      await this.flushQueue()
    }
  }

  async runAfterDispose(flush = true) {
    if (this.$child) {
      await this.$child.runAfterDispose(false)
    }
    await sequence(this._afterDisposeCallbacks)
    if (flush) {
      await this.flushQueue()
    }
  }

  private static runMiddleware(middleware: Middleware[], ...args): [
    Promise<any>,
    () => Promise<any>
  ] {
    const downstream = []

    const callbacks = middleware.map((fn) => {
      const runner = Context.generatorify(fn)(...args)
      const run: AsyncCallback = async () => {
        let ret = runner.next();
        ret = isThenable(ret)
          ? await ret
          : ret.value
        return ret || true
      }
      downstream.push(run)
      return run
    })

    return [
      sequence(callbacks, ...args),
      () => sequence(callbacks, ...args),
    ]
  }

  // ts why u no haz async generators?? babel why ur generators so $$$?????
  private static generatorify(fn) {
    return isGenerator(fn)
      ? fn
      : function(...args) {
        let count = 1, ret
        return {
          async next() {
            switch (count++) {
            case 1:
              ret = await promisify(fn)(...args) || false
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
