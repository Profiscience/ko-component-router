###
<ko-component-router> component definition

@param router {Router} ko.router (to preserve ko context)
@return {Component} <ko-component-router> definition
###
koRouterComponent = (router) ->
  template:     require './template'
  viewModel:    require('./ViewModel').bind(null, router)
  synchronous:  true

module.exports = koRouterComponent