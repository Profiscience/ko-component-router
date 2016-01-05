'use strict'

const ko = require('knockout')
const router = require('./router')
require('./binding')

ko.components.register('ko-component-router', {
  synchronous: true,
  viewModel: router,
  template:
    `<div data-bind='if: ctx.component'>
      <div data-bind='component: {
        name: ctx.component,
        params: ctx
      }'></div>
    </div>`
})
