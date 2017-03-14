import ko from 'knockout'

const _register = ko.components.register

ko.components.register = (name, {
  template = '<div></div>',
  viewModel = class { }
}) => {
  if (ko.components.isRegistered(name)) {
    ko.components.unregister(name)
    ko.components.clearCachedDefinition(name)
  }
  return _register(name, { template, viewModel })
}
