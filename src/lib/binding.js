'use strict'

var ko = require('knockout')

var router = require('./router')

ko.bindingHandlers.route = {
  init: function(el, valueAccessor) {
    ko.applyBindingsToNode(el, {
      attr: {
        href: ko.pureComputed(function() {
          return router._basePath + ko.unwrap(valueAccessor())
        })
      }
    })
  }
}
