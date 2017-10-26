import * as ko from 'knockout'
import { Router } from './router'
import { map, traversePath } from './utils'

declare global {
  // tslint:disable-next-line interface-name
  interface KnockoutBindingContext {
    $router: Router
  }
}

ko.components.register('ko-component-router', {
  synchronous: true,
  viewModel: { createViewModel },
  template:
    `<div data-bind="if: component">
      <div class="ko-component-router-view" data-bind="__ko_component_router__"></div>
    </div>`
})

ko.bindingHandlers.__ko_component_router__ = {
  init(el, valueAccessor, allBindings, viewModel, bindingCtx) {

    const $router: Router = bindingCtx.$rawData

    ko.applyBindingsToNode(el, {
      css: $router.component,
      component: {
        name: $router.component,
        params: $router.ctx
      }
    }, bindingCtx.extend({ $router }))

    if ($router.isRoot) {
      $router.init()
    } else {
      $router.ctx.$parent.router.initialized.then(() => $router.init())
    }

    return { controlsDescendantBindings: true }
  }
}

function createViewModel(params: { [k: string]: any }) {
  let router = Router.head
  if (!router) {
    router = new Router(Router.getPathFromLocation(), undefined, params)
  } else {
    while (router.bound) {
      router = router.ctx.$child.router
    }
  }
  router.bound = true

  if (router.isRoot) {
    router.ctx.runBeforeRender()
      .then(() => {
        if (router.ctx._redirect) {
          router.ctx.runAfterRender().then(() => {
            const { router: r, path: p } = traversePath(router, router.ctx._redirect)
            r.update(p, router.ctx._redirectArgs)
          })
        } else {
          router.ctx.render()
          map(Router.onInit, (resolve) => resolve(router))
        }
      })
  } else if (router.ctx._redirect) {
    const { router: r, path: p } = traversePath(router, router.ctx._redirect)
    setTimeout(() => r.update(p, router.ctx._redirectArgs))
  }

  return router
}
