ko = require 'knockout'

ko.router       = require 'page'
ko.router.state = require './lib/state'
ko.router.utils = require './lib/utils'

module.exports = do ->

  ko.components.register 'ko-component-router',
    viewModel = require './lib/viewModel'
    template  = require './lib/template'