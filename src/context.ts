import Route from './Route'
import Router from './router'
import { isUndefined, runMiddleware, sequence } from './utils'

export default class Context {
  fullPath: string
  router: Router
  pathname: string
  canonicalPath: string
  route: Route

  private _queue
  private _beforeNavigateCallbacks
  private _afterRenderCallbacks
  private _beforeDisposeCallbacks
  private _afterDisposeCallbacks

  constructor(params) {
    Object.assign(this, params)

    this.fullPath = this.router.base + this.pathname
    this.canonicalPath = this.fullPath.replace(new RegExp(this.router.$root.base, 'i'), '')

    this._queue = []
    this._beforeNavigateCallbacks = []
    this._afterRenderCallbacks = []
    this._beforeDisposeCallbacks = []
    this._afterDisposeCallbacks = []
  }

  addBeforeNavigateCallback(cb) {
    this._beforeNavigateCallbacks.unshift(cb)
  }

  get $parent(): Context {
    return this.router.isRoot
      ? undefined
      : this.router.$parent.ctx
  }

  get $parents(): Array<Context> {
    return this.router.$parents.map((r) => r.ctx)
  }

  get $child(): Context {
    return isUndefined(this.router.$child)
      ? undefined
      : this.router.$child.ctx
  }

  get $children(): Array<Context> {
    return this.router.$children.filter((r) => !isUndefined(r.ctx)).map((r) => r.ctx)
  }

  get element(): Element {
    return document.getElementsByClassName('ko-component-router-view')[this.router.depth]
  }

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
    await Promise.all(this._queue).then(() => (this._queue = []))
  }

  async runBeforeRender() {
    const [appBeforeRender, appDownstream] = runMiddleware(Router.middleware, this)

    this._afterRenderCallbacks.push(appDownstream)
    this._beforeDisposeCallbacks.push(appDownstream)
    this._afterDisposeCallbacks.push(appDownstream)

    await appBeforeRender

    const [routeBeforeRender, routeDownstream] = runMiddleware(this.route.middleware, this)

    this._afterRenderCallbacks.push(routeDownstream)
    this._beforeDisposeCallbacks.unshift(routeDownstream)
    this._afterDisposeCallbacks.unshift(routeDownstream)

    await routeBeforeRender
    await this.flushQueue()
  }

  async runAfterRender() {
    await sequence(this._afterRenderCallbacks)
    await this.flushQueue()
  }

  async runBeforeDispose() {
    if (this.$child) {
      await this.$child.runBeforeDispose()
    }
    await sequence(this._beforeDisposeCallbacks)
    await this.flushQueue()
  }

  async runAfterDispose() {
    await sequence(this._afterDisposeCallbacks)
    await this.flushQueue()
  }
}
