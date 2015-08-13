'use strict'

var ko = require('knockout')

var router = require('./router')

function ViewModel() {
  this.component = router._component
  this.ctx = router._ctx
}

ko.components.register('ko-component-router', {
  viewModel: ViewModel,
  template: "<div data-bind='component: {" +
              "name: component," +
              "params: ctx" +
            "}'></div>"
})

module.exports = ViewModel
