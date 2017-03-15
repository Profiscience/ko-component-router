import ko from 'knockout'
import Router from './router'
import { isUndefined, traversePath } from './utils'

ko.bindingHandlers.path = {
  init(el, valueAccessor, allBindings, viewModel, bindingCtx) {
    const activePathCSSClass = allBindings.get('pathActiveClass') || Router.config.activePathCSSClass

    Router.initialized.then(() => {
      const route = ko.pureComputed(() => traversePath(getRouter(bindingCtx), ko.unwrap(valueAccessor())))
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
  return router.ctx.base + path
}

export function isActivePath({ router, path }) {
  return (router.ctx.pathname || '/') === ('/' + path.split('/')[1])
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
