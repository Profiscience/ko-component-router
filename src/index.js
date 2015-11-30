'use strict'

const ko = require('knockout')
const router = require('./router')

ko.components.register('ko-component-router', {
  viewModel: router,
  template:
    `<div data-bind='if: ctx.component'>
      <div data-bind='component: {
        name: ctx.component,
        params: ctx
      }'></div>
    </div>`
})
