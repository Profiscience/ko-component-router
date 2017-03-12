import ko from 'knockout'
import Router from './router'
import './binding'

ko.components.register('ko-component-router', {
  synchronous: true,
  viewModel: Router,
  template:
    `<div data-bind="if: component">
      <div class="ko-component-router-view" data-bind="__ko_component_router__"></div>
    </div>`
})

ko.bindingHandlers['__ko_component_router__'] = {
  init(el, valueAccessor, allBindings, viewModel, bindingCtx) {

    const $router = bindingCtx.$rawData

    ko.applyBindingsToNode(el, {
      css: $router.component,
      component: {
        name: $router.component,
        params: $router.ctx
      }
    }, bindingCtx.extend({ $router }))

    return { controlsDescendantBindings: true }
  }
}

export default Router
export { default as Context } from './context'
export { default as Route } from './route'
