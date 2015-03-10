_testComponents = []

module.exports =

  register: (_ko, vm, template = '<span></span>') ->
    alias = 'test' + _testComponents.length

    _testComponents.push alias

    _ko.components.register alias,
      template: template
      viewModel: vm

    return alias

  unregister: (_ko) ->
    _ko.components.unregister component for component in _testComponents
    _testComponents = []
