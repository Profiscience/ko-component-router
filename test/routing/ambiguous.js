import ko from 'knockout'

ko.components.register('ambiguous', {
  template: '<ko-component-router params="routes: routes"></ko-component-router>',
  viewModel: class AmbiguousRoutingTest {
    constructor({ t, next }) {

      this.routes = {
        '/': {
          '/a': {
            '/b': 'wrong'
          }
        },
        '/a': {
          '/b': {
            '/c': 'right'
          }
        }
      }

      ko.components.register('wrong', {
        template: '<div></div>',
        viewModel() {
          t.fail('fails on ambiguous routes w/ nested shorthand')
          next()
        }
      })

      ko.components.register('right', {
        template: '<div></div>',
        viewModel() {
          t.pass('figures out ambiguous routes w/ nested shorthand')
          next()
        }
      })
    }

    dispose() {
      ko.components.unregister('wrong')
      ko.components.unregister('right')
    }
  }
})

export default { '/ambiguous/!': 'ambiguous' }
