'use strict'

var ko = require('knockout')
var page = require('page')

function Router() {
  this.component = ko.observable()
  this.ctx = ko.observable()
}

Router.prototype.start = function(config) {
  if (config && config.basePath)
    page.base(config.basePath)

  page.start(config)

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

  for (i = 0; i < stack.length; i++) {
    el = stack[i]

    switch (typeof el) {
      case 'string':
        arg = getComponentSetter(el)
        break

      default:
        arg = el
    }

    args.push(arg)
  }

  page.apply(page, args)

  function getComponentSetter(component) {
    return function(ctx, next) {
      self.component(component)
      self.ctx(ctx)
      ctx.handled = true
      next()
    }
  }
}

module.exports = new Router()
