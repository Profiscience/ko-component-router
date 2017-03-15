import ko from 'knockout'

import Router from '../dist/test'

ko.components.register('redirect', {
  template: '<ko-component-router></ko-component-router>',
  viewModel: class RedirectTest {
    constructor({ t, done }) {
      const fooPre = {}
      const barPre = {}

      history.pushState(null, null, '/notfoo')

      Router.use(
        () => ({
          beforeRender() {
            fooPre.beforeRender = true
          },
          afterRender() {
            fooPre.afterRender = true
          },
          beforeDispose() {
            fooPre.beforeDispose = true
          },
          afterDispose() {
            fooPre.afterDispose = true
          }
        }),
        (ctx) => {
          if (ctx.pathname === '/notfoo') {
            ctx.redirect('/foo')
          }
        },
        (ctx) => ({
          beforeRender() {
            if (ctx.pathname === '/notfoo') {
              t.fail('beforeRender middleware after redirect in global middleware should not be executed')
            }
          },
          afterRender() {
            if (ctx.pathname === '/notfoo') {
              t.fail('afterRender middleware after redirect in global middleware should not be executed')
            }
          },
          beforeDispose() {
            if (ctx.pathname === '/notfoo') {
              t.fail('beforeDispose middleware after redirect in global middleware should not be executed')
            }
          },
          afterDispose() {
            if (ctx.pathname === '/notfoo') {
              t.fail('afterDispose middleware after redirect in global middleware should not be executed')
            }
          }
        }))

      Router.useRoutes({
        '/notfoo': 'notfoo',
        '/foo': 'foo',
        '/notbar': [
          'notbar',
          () => ({
            beforeRender() {
              barPre.beforeRender = true
            },
            afterRender() {
              barPre.afterRender = true
            },
            beforeDispose() {
              barPre.beforeDispose = true
            },
            afterDispose() {
              barPre.afterDispose = true
            }
          }),
          (ctx) => {
            ctx.redirect('/bar')
          },
          () => ({
            beforeRender() {
              t.fail('beforeRender middleware after redirect in route middleware should not be executed')
            },
            afterRender() {
              t.fail('afterRender middleware after redirect in route middleware should not be executed')
            },
            beforeDispose() {
              t.fail('beforeDispose middleware after redirect in route middleware should not be executed')
            },
            afterDispose() {
              t.fail('afterDispose middleware after redirect in route middleware should not be executed')
            }
          })
        ],
        '/bar': 'bar'
      })

      ko.components.register('notfoo', {
        viewModel: class {
          constructor() {
            t.fail('global redirect should not have intermediate render')
          }
        }
      })

      ko.components.register('notbar', {
        viewModel: class {
          constructor() {
            t.fail('route redirect should not have intermediate render')
          }
        }
      })

      ko.components.register('foo', {
        synchronous: true,
        viewModel: class {
          constructor() {
            t.true(fooPre.beforeRender, 'pre global redirect beforeRender is ran')
            t.true(fooPre.afterRender, 'pre global redirect afterRender is ran')
            t.true(fooPre.beforeDispose, 'pre global redirect beforeDispose is ran')
            t.true(fooPre.afterDispose, 'pre global redirect afterDispose is ran')

            Router.update('/notbar')
          }
        }
      })

      ko.components.register('bar', {
        synchronous: true,
        viewModel: class {
          constructor() {
            t.true(barPre.beforeRender, 'pre route redirect beforeRender is ran')
            t.true(barPre.afterRender, 'pre route redirect afterRender is ran')
            t.true(barPre.beforeDispose, 'pre route redirect beforeDispose is ran')
            t.true(barPre.afterDispose, 'pre route redirect afterDispose is ran')

            done()
          }
        }
      })
    }
  }
})
