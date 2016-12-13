import ko from 'knockout'
import { isUndefined, sequence } from './utils'

export default class Context {
  constructor({ router, route, path, pathname, params, passthrough }) {
    // ensure args take precedence over passthrough so as not to break
    // nested route shorthand
    Object.assign(this, passthrough, {
      router,
      route,
      path,
      pathname,
      params,
      fullPath: router.config.base + pathname,
      canonicalPath: (router.config.base + pathname).replace(new RegExp(ko.router.config.base, 'i'), '')
    })

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
