import ko from 'knockout'
import qs from 'qs'
import { isUndefined } from './utils'

ko.bindingHandlers.path = { init(e, xx, b, x, c) { applyBinding.call(this, e, b, c) } }
ko.bindingHandlers.state = { init(e, xx, b, x, c) { applyBinding.call(this, e, b, c) } }
ko.bindingHandlers.query = { init(e, xx, b, x, c) { applyBinding.call(this, e, b, c) } }
ko.bindingHandlers.path.utils = { resolveHref }

export function resolveHref(ctx, path, query) {
  let [router, route] = getRoute(ctx, path)
  const querystring = query
    ? '?' + qs.stringify(ko.toJS(query))
    : ''

  while (router.$parent) {
    route = router.config.base + route
    router = router.$parent
  }

  return router
    ? router.config.base
      + (!router.config.hashbang || router.$parent ? '' : '/#!')
      + route
      + querystring
    : '#'
}

function applyBinding(el, bindings, ctx) {
  const path = bindings.has('path') ? bindings.get('path') : false
  const query = bindings.has('query') ? bindings.get('query') : false
  const state = bindings.has('state') ? bindings.get('state') : false

  const bindingsToApply = {}
  el.href = '#'

  bindingsToApply.click = (data, e) => {
    const debounce = 1 !== which(e)
    const hasOtherTarget = el.hasAttribute('target')
    const hasExternalRel = el.getAttribute('rel') === 'external'
    const modifierKey = e.metaKey || e.ctrlKey || e.shiftKey

    if (debounce || hasOtherTarget || hasExternalRel || modifierKey) {
      return true
    }

    const [router, route] = getRoute(ctx, path)
    const handled = router.update(route, ko.toJS(state), true, ko.toJS(query), true)

    if (handled) {
      e.preventDefault()
      e.stopImmediatePropagation()
    } else if (!router.$parent) {
      console.error(`[ko-component-router] ${path} did not match any routes!`) // eslint-disable-line
    }

    return !handled
  }

  bindingsToApply.attr = {
    href: ko.pureComputed(() => resolveHref(ctx, bindings.get('path'), query))
  }

  if (path) {
    bindingsToApply.css = {
      'active-path': ko.pureComputed(() => {
        const [router, route] = getRoute(ctx, path)
        return !router.isNavigating() && router.route() !== '' && route
          ? router.route().matches(route)
          : false
        })
    }
  }

  // allow adjacent routers to initialize
  ko.tasks.schedule(() => ko.applyBindingsToNode(el, bindingsToApply))
}

function getRoute(ctx, path) {
  let router = getRouter(ctx)
  let route = path ? ko.unwrap(path) : router.canonicalPath()

  if (route.indexOf('//') === 0) {
    route = route.replace('//', '/')

    while (router.$parent) {
      router = router.$parent
    }
  } else {
    while (route && route.match(/\/?\.\./i) && router.$parent) {
      router = router.$parent
      route = route.replace(/\/?\.\./i, '')
    }
  }

  return [router, route]
}

function getRouter(ctx) {
  while (!isUndefined(ctx)) {
    if (!isUndefined(ctx.$router)) {
      return ctx.$router
    }

    ctx = ctx.$parentContext
  }
}

function which(e) {
  e = e || window.event
  return null === e.which ? e.button : e.which
}
