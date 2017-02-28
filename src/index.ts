import * as ko from 'knockout'
import Router from './router'
import './binding'

ko.components.register('ko-component-router', {
  synchronous: true,
  viewModel: {
    createViewModel: (params) => new Router(unwrapParams(params))
  },
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

function unwrapParams(params) {
  function unwrapParam(p) {
    if (ko.isObservable(params[p])) {
      // eslint-disable-next-line no-console
      console.warn(`
        [ko-component-router] \`params.${p}\` was passed in as an observable.
        It willbe unwrapped, but changes will NOT be observed.
    `)
      params[p] = ko.unwrap(params[p])
    }
  }
  unwrapParam('routes')
  unwrapParam('base')
  unwrapParam('hashbang')
  return params
}

export default Router

module.exports = exports['default'];
