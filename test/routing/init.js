import ko from 'knockout'

ko.components.register('init', {
  template: '<div></div>',
  viewModel: class {
    constructor({ t, next }) {
      t.pass('initializes')
      next()
    }
    dispose() {
      ko.components.unregister('init')
    }
  }
})

export default { '/init': 'init' }
