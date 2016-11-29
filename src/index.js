import ko from 'knockout'
import Router from './router'

ko.components.register('ko-component-router', {
  synchronous: true,
  viewModel: { createViewModel: (params, { element }) => new Router(params, element) },
  template:
    `<div data-bind='if: component'>
      <div data-bind='
        attr: { class: "ko-component-router-view " + component() },
        component: {
          name: component,
          params: ctx
        }'>
      </div>
    </div>`
})

ko.router = Router

export default Router
