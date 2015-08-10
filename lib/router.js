'use strict'

var ko = require('knockout')
var _ = require('lodash')
var page = require('page')

function Router(config) {
  var self = this

  self.component = ko.observable()
  self.params = {}
  self.middleware = [
    _setParams
  ]

  self.config = {
    hashbang: false,
    basePath: ''
  }

  page(_applyMiddleware)

  function _applyMiddleware(ctx, next) {
    _.reduceRight(self.middleware, function(memo, fn) {
      return fn.bind(fn, ctx, memo)
    }, next)()
  }

  function _setParams(ctx, next) {
    _.each(ctx.params, function(v, k) {
      self.params[k] = ko.observable(v)
    })
    next()
  }
}

Router.prototype.start = function(config) {
  _.extend(this.config, config)
  page.base(this.config.basePath)
  page.start(this.config)
  require('./component')
}

Router.prototype.show = function(path) {
  page.show(path)
}

Router.prototype.redirect = function(path) {
  page.redirect(path)
}

Router.prototype.route = function(route) {
  var self = this
  var stack = []

  // don't splice on arguments
  for(var i = 1; i < arguments.length; i++)
    stack.push(arguments[i])

  page.apply(page, [route].concat(_.map(stack, function(el) {
    if (_.isString(el))
      return function(ctx, next) {
        self.component(el)
        ctx.handled = true
        next()
      }
    else
      return el
  })))
}

module.exports = new Router()
