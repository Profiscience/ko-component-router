import ko from 'knockout'

ko.components.register('ambiguous', {
  template: '<ko-component-router></ko-component-router>',
  viewModel: class AmbiguousRoutingTest {
    constructor({ t, done }) {
      ko.components.register('wrong', {
        viewModel: class {
          constructor() {
            t.fail('fails on ambiguous routes w/ nested shorthand')
            done()
          }
        }
      })

      ko.components.register('right', {
        viewModel: class {
          constructor() {
            t.pass('figures out ambiguous routes w/ nested shorthand')
            done()
          }
        }
      })
    }
  }
})

export const path = '/ambiguous/a/b/c'

export const routes = {
  '/ambiguous': ['ambiguous',
    {
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
  ]
}
