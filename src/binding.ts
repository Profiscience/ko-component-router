import ko from 'knockout'
import $ from 'jquery'
import Router from './router'
import { isUndefined } from './utils'

ko.bindingHandlers['path'] = {
  init(el, valueAccessor, allBindings, viewModel, bindingCtx) {
    const activePathCSSClass = allBindings.get('pathActiveClass') || Router.config.activePathCSSClass
    
    Router.initialized.then(() => {
      const route = ko.pureComputed(() => parsePathBinding(bindingCtx, ko.unwrap(valueAccessor())))
      ko.applyBindingsToNode(el, {
        attr: {
          href: ko.pureComputed(() => resolveHref(route()))
        },
        css: {
          [activePathCSSClass]: ko.pureComputed(() => isActivePath(route()))
        }
      })
    })
  }
}

export function resolveHref({ router, path }) {
  return router.base + path
}

export function isActivePath({ router, path }) {
  return (router.ctx.pathname || '/') === ('/' + path.split('/')[1])
}

function parsePathBinding(bindingCtx, path) {
  let router = getRouter(bindingCtx)

  if (path.indexOf('//') === 0) {
    path = path.replace('//', '/')

    while (!router.isRoot) {
      router = router.$parent
    }
  } else {
    if (path.indexOf('./') === 0) {
      path = path.replace('./', '/')
      router = router.$child
    }

    while (path && path.match(/\/?\.\./i) && !router.isRoot) {
      router = router.$parent
      path = path.replace(/\/?\.\./i, '')
    }
  }

  return { router, path }
}

function getRouter(bindingCtx) {
  while (!isUndefined(bindingCtx)) {
    if (!isUndefined(bindingCtx.$router)) {
      return bindingCtx.$router
    }
    bindingCtx = bindingCtx.$parentContext
  }
  return Router.head
}