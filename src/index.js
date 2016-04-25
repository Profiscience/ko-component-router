'use strict'

const ko = require('knockout')
const router = require('./router')
require('./binding')

ko.components.register('ko-component-router', {
  synchronous: true,
  viewModel: router,
  template:
    `<div data-bind='if: ctx.route().component'>
      <div class="component-wrapper" data-bind='component: {
        name: ctx.route().component,
        params: ctx
      }'></div>
    </div>`
})
