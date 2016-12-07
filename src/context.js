import { isUndefined, sequence } from './utils'

export default class Context {
  constructor({ router, route, path, pathname, params, passthrough }) {
    this.router = router
    this.route = route
    this.path = path
    this.pathname = pathname
    this.fullPath = this.router.base + this.pathname
    this.params = params

    Object.assign(this, passthrough)

    this._beforeNavigateCallbacks = []
  }

  addBeforeNavigateCallback(cb) {
    this._beforeNavigateCallbacks.unshift(cb)
  }

  get $parent() {
    return this.router.isRoot
      ? undefined
      : this.router.$parent.ctx
  }

  get $child() {
    return isUndefined(this.router.$child)
      ? undefined
      : this.router.$child.ctx
  }

  get element() {
    return document.getElementsByClassName('ko-component-router-view')[this.router.depth - 1]
  }

  async runBeforeNavigateCallbacks() {
    let ctx = this
    let callbacks = []
    while (ctx) {
      callbacks = [...ctx._beforeNavigateCallbacks, ...callbacks]
      ctx = ctx.$child
    }
    return await sequence(callbacks)
  }
}
