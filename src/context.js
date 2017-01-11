import { isUndefined, sequence } from './utils'

export default class Context {
  constructor(params) {
    Object.assign(this, params)

    this.fullPath = this.router.base + this.pathname
    this.canonicalPath = this.fullPath.replace(new RegExp(this.router.$root.base, 'i'), '')
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

  get $parents() {
    return this.router.$parents.map((r) => r.ctx)
  }

  get $child() {
    return isUndefined(this.router.$child)
      ? undefined
      : this.router.$child.ctx
  }

  get $children() {
    return this.router.$children.map((r) => r.ctx)
  }

  get element() {
    return document.getElementsByClassName('ko-component-router-view')[this.router.depth]
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
