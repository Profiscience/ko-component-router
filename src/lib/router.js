'use strict'

var ko = require('knockout')
var page = require('page')

function Router(config) {
  var self = this
  var k

  self.component = ko.observable()
  self.params = {}
  self.middleware = [
    _setParams
  ]

  self.config = {
    hashbang: false,
    basePath: ''
  }

  function _setParams(ctx, next) {
    for (k in ctx.params) {
      self.params[k] = ko.observable(ctx.params[k])
    }
    next()
  }
}

Router.prototype.start = function(config) {
  this.config.basePath = config.basePath || ''
  this.config.hashbang = config.hashbang === true

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
  var args, arg, i, el

  // don't splice on arguments
  for(i = 1; i < arguments.length; i++)
    stack.push(arguments[i])

  args = [route]
  args.concat(self.middleware)

  for (i = 0; i < stack.length; i++) {
    el = stack[i]

    switch (typeof el) {
      case 'string':
        arg = _getComponentSetter(el)
        break

      default:
        arg = el
    }

    args.push(arg)
  }

  page.apply(page, args)

  function _getComponentSetter(el) {
    return function(ctx, next) {
      self.component(el)
      ctx.handled = true
      next()
    }
  }
}

module.exports = new Router()
