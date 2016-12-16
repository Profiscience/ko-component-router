import ko from 'knockout'
import { isUndefined } from './utils'

ko.bindingHandlers.path = {
  init(el, valueAccessor, allBindings, viewModel, bindingCtx) {
    // allow adjacent routers to initialize
    ko.tasks.schedule(() => ko.applyBindingsToNode(el, {
      attr: {
        href: resolveHref(bindingCtx, valueAccessor())
      },
      css: {
        'active-path': ko.pureComputed(() => isActivePath(bindingCtx, valueAccessor()))
      }
    }))
  }
}

export function resolveHref(bindingCtx, _path) {
  const [router, path] = parsePathBinding(bindingCtx, _path)
  return router.base + path
}

function isActivePath(bindingCtx, _path) {
  const [router, path] = parsePathBinding(bindingCtx, _path)
  return !router.isNavigating() && (router.ctx.pathname || '/') === ('/' + path.split('/')[1])
}

function parsePathBinding(bindingCtx, path) {
  let router = getRouter(bindingCtx)

  if (path.indexOf('//') === 0) {
    path = path.replace('//', '/')

    while (!router.isRoot) {
      router = router.$parent
    }
  } else {
    while (path && path.match(/\/?\.\./i) && !router.isRoot) {
      router = router.$parent
      path = path.replace(/\/?\.\./i, '')
    }
  }

  return [router, path]
}

function getRouter(bindingCtx) {
  while (!isUndefined(bindingCtx)) {
    if (!isUndefined(bindingCtx.$router)) {
      return bindingCtx.$router
    }
    bindingCtx = bindingCtx.$parentContext
  }
}
