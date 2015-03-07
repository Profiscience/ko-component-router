ko = require 'knockout'

_testComponents = []

module.exports =

  register: (vm, template = '<span></span>') ->
    alias = 'test' + _testComponents.length

    _testComponents.push alias

    ko.components.register alias,
      template: template
      viewModel: vm

    return alias

  unregister: ->
    ko.components.unregister component for component in _testComponents
    _testComponents = []
