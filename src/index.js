'use strict'

const ko = require('knockout')
const router = require('./router')

ko.components.register('ko-component-router', {
  viewModel: router,
  template:
    `<div data-bind='if: component'>
      <div data-bind='component: {
        name: component,
        params: ctx
      }'></div>
    </div>`
})
