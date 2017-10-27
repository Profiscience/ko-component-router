import * as ko from 'knockout'
import { Router } from '../router'
import { resolveHref, traversePath, getRouterForBindingContext } from '../utils'
import { activePathBinding } from './active-path'

export const pathBinding: KnockoutBindingHandler = {
  init(el, valueAccessor, allBindings, viewModel, bindingCtx) {
    const path = ko.unwrap(valueAccessor())

    activePathBinding.init.apply(this, arguments)

    Router.initialized.then(() => {
      const router = getRouterForBindingContext(bindingCtx)
      const route = ko.pureComputed(() => traversePath(router, path))
      ko.applyBindingsToNode(el, {
        attr: {
          href: ko.pureComputed(() => resolveHref(route()))
        }
      })
    })
  }
}

ko.bindingHandlers.path = pathBinding
