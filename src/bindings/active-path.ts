import * as ko from 'knockout'
import { Router } from '../router'
import { isActivePath, traversePath, getRouter } from '../utils'

ko.bindingHandlers.activePath = {
  init(el, valueAccessor, allBindings, viewModel, bindingCtx) {
    const activePathCSSClass = allBindings.get("pathActiveClass") || Router.config.activePathCSSClass
    
    Router.initialized.then(() => {
        const route = ko.pureComputed(() => traversePath(getRouter(bindingCtx), ko.unwrap(valueAccessor())))
        ko.applyBindingsToNode(el, {
            css: {
              [activePathCSSClass]: ko.pureComputed(() => isActivePath(route()))
            }
        })
    })
  }
}