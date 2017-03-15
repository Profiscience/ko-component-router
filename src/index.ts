import { map } from 'lodash-es'
import ko from 'knockout'
import Router from './router'
import './binding'

export default Router
export { default as Context } from './context'
export { default as Route } from './route'

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

    const $router = bindingCtx.$rawData

    ko.applyBindingsToNode(el, {
      css: $router.component,
      component: {
        name: $router.component,
        params: $router.ctx
      }
    }, bindingCtx.extend({ $router }))

    $router.init()

    return { controlsDescendantBindings: true }
  }
}

function createViewModel(params) {
  let router
  if (!Router.head) {
    router = new Router(Router.getPathFromLocation(), undefined, params)
  } else {
    router = Router.head
    while (router.bound) {
      router = router.ctx.$child.router
    }
  }
  router.bound = true

  if (router.isRoot) {
    router.ctx.runBeforeRender()
      .then(() => {
        router.ctx.render()
        map(Router.onInit, (resolve) => resolve(this))
        return
      })
  }

  return router
}
