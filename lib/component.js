'use strict'

var ko = require('knockout')

var router = require('./router')

ko.components.register('ko-component-router', {
  viewModel: function ViewModel() {
    this.component = router.component
    this.params = router.params
  },
  template: "<div data-bind='component: {" +
              "name: component," +
              "params: params" +
            "}'></div>"
})
