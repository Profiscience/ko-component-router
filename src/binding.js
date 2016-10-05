import ko from 'knockout'
import qs from 'qs'
import { isUndefined } from './utils'

ko.bindingHandlers.path = { init(e, xx, b, x, c) { applyBinding.call(this, e, b, c) } }
ko.bindingHandlers.state = { init(e, xx, b, x, c) { applyBinding.call(this, e, b, c) } }
ko.bindingHandlers.query = { init(e, xx, b, x, c) { applyBinding.call(this, e, b, c) } }
ko.bindingHandlers.path.utils = { resolveHref }

export function resolveHref(bindingCtx, _path, query) {
  let [ctx, path] = parsePathBinding(bindingCtx, _path)
  const querystring = query
    ? '?' + qs.stringify(ko.toJS(query))
    : ''

  while (ctx.$parent) {
    path = ctx.config.base + path
    ctx = ctx.$parent
  }

  return ctx
    ? ctx.config.base
      + (!ctx.config.hashbang || ctx.$parent ? '' : '/#!')
      + path
      + querystring
    : '#'
}

function applyBinding(el, bindings, bindingCtx) {
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

    const [router, route] = parsePathBinding(bindingCtx, path)
    const handled = router._update(route, ko.toJS(state), true, ko.toJS(query), true)

    if (handled) {
      e.preventDefault()
      e.stopImmediatePropagation()
    } else if (!router.$parent) {
      console.error(`[ko-component-router] ${path} did not match any routes!`) // eslint-disable-line
    }

    return !handled
  }

  bindingsToApply.attr = {
    href: ko.pureComputed(() => resolveHref(bindingCtx, bindings.get('path'), query))
  }

  if (path) {
    bindingsToApply.css = {
      'active-path': ko.pureComputed(() => isActivePath(bindingCtx, path))
    }
  }

  // allow adjacent routers to initialize
  ko.tasks.schedule(() => ko.applyBindingsToNode(el, bindingsToApply))
}

function isActivePath(bindingCtx, _path) {
  let [ctx, path] = parsePathBinding(bindingCtx, _path)

  if (localPathMatches(ctx, path)) {
    while (ctx.$child) {
      ctx = ctx.$child
      path = path.replace(ctx.config.base, '') || '/'
      if (!localPathMatches(ctx, path)) {
        return false
      }
    }
    return true
  } else if (ctx.$parent) {
    return isActivePath(ctx.bindingCtx.$parentContext, path)
  } else {
    return false
  }
}

function parsePathBinding(bindingCtx, _path) {
  let ctx = getRouter(bindingCtx)
  let path = _path ? ko.unwrap(_path) : ctx.canonicalPath()

  if (path.indexOf('//') === 0) {
    path = path.replace('//', '/')

    while (ctx.$parent) {
      ctx = ctx.$parent
    }
  } else {
    while (path && path.match(/\/?\.\./i) && ctx.$parent) {
      ctx = ctx.$parent
      path = path.replace(/\/?\.\./i, '')
    }
  }

  return [ctx, path]
}

function getRouter(bindingCtx) {
  while (!isUndefined(bindingCtx)) {
    if (!isUndefined(bindingCtx.$router)) {
      return bindingCtx.$router
    }

    bindingCtx = bindingCtx.$parentContext
  }
}

function localPathMatches(ctx, path) {
  return (ctx.pathname() || '/') === ('/' + path.split('/')[1])
}

function which(e) {
  e = e || window.event
  return null === e.which ? e.button : e.which
}
