import ko from 'knockout'
import router from './router'
import './binding'

ko.components.register('ko-component-router', {
  viewModel: router,
  template:
    `<div data-bind='if: ctx.route().component'>
      <div class="component-wrapper" data-bind='component: {
        name: ctx.route().component,
        params: ctx
      }'></div>
    </div>`
})
