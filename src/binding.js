'use strict'

const ko = require('knockout')

ko.bindingHandlers.path = { init(e, xx, b, x, c) { applyBinding.call(this, e, b, c) } }
ko.bindingHandlers.state = { init(e, xx, b, x, c) { applyBinding.call(this, e, b, c) } }
ko.bindingHandlers.query = { init(e, xx, b, x, c) { applyBinding.call(this, e, b, c) } }

function applyBinding(el, bindings, ctx) {
  const bindingsToApply = {}
  el.href = '#'

  bindingsToApply.click = (data, e) => {
    let router = getRouter(ctx)
    let url = bindings.has('path') ? bindings.get('path') : router.canonicalPath()
    const state = bindings.has('state') ? ko.toJS(bindings.get('state')): false
    const query = bindings.has('query') ? bindings.get('query') : false

    while (url.indexOf('/..') > -1) {
      router = router.$parent
      url = url.replace('/..', '')
    }

    if (router.update(url, state, true, query)) {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
    }
  }

  bindingsToApply.clickBubble = false

  if (bindings.has('path')) {
    bindingsToApply.css = {
      'active-path': ko.pureComputed(() => {
        const router = getRouter(ctx)
        const path = ko.unwrap(bindings.get('path'))
        return router.route() !== '' && path
          ? router.route().matches(path)
          : false
        })
    }
  }

  // allow adjacent routers to initialize
  ko.tasks.schedule(() => ko.applyBindingsToNode(el, bindingsToApply))
}

function getRouter(ctx) {
  while (typeof ctx !== 'undefined') {
    if (typeof ctx.$router !== 'undefined') {
      return ctx.$router
    }

    ctx = ctx.$parentContext
  }
}
