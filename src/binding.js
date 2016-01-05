'use strict'

const ko = require('knockout')

ko.bindingHandlers.path = { init(e, xx, b, x, c) { applyBinding.call(this, e, b, c) } }
ko.bindingHandlers.state = { init(e, xx, b, x, c) { applyBinding.call(this, e, b, c) } }
ko.bindingHandlers.query = { init(e, xx, b, x, c) { applyBinding.call(this, e, b, c) } }

function applyBinding(el, bindings, ctx) {
  const bindingsToApply = {}
  el.href = '#'

  bindingsToApply.click = (data, e) => {
    const router = getRouter(ctx)
    const url = bindings.has('path') ? bindings.get('path') : router.canonicalPath()
    const state = bindings.has('state') ? bindings.get('state') : router.state()
    const query = bindings.has('query') ? bindings.get('query') : router.query.getAll()
    router.update(url, state, true, query)

    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
  }

  if (bindings.has('path')) {
    bindingsToApply.css = {
        'active-path': ko.pureComputed(() =>
          ctx.$router.route() !== ''
            ? ctx.$router.route().matches(bindings.get('path'))
            : false)
      }

  }

  // allow adjacent routers to initialize
  window.requestAnimationFrame(() => {
    ko.applyBindingsToNode(el, bindingsToApply)
  })
}

function getRouter(ctx) {
  while (typeof ctx !== 'undefined') {
    if (typeof ctx.$router !== 'undefined') {
      return ctx.$router
    }

    ctx = ctx.$parent
  }

  throw new Error('ko-component-router bindings must be within a router')
}
