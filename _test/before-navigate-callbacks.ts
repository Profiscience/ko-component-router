import ko from 'knockout'
import Router from '../dist/modules'

ko.components.register('before-navigate-callbacks', {
  template: '<ko-component-router params="routes: routes"></ko-component-router>',
  viewModel: class BeforeNavigateCallbackTest {
    constructor({ t, next }) {
      this.routes = {
        '/': 'empty',
        '/sync': 'sync',
        '/async-callback': 'async-callback',
        '/async-promise': 'async-promise',
        '/nested/!': 'nested'
      }

      ko.components.register('empty', {})

      setTimeout(() => this.runTests(t).then(next))
    }

    async runTests(t) {
      let block

      history.replaceState(null, null, '/sync')

      ko.components.register('sync', {
        viewModel(ctx) {
          ctx.addBeforeNavigateCallback(() => !block)
        }
      })

      ko.components.register('async-callback', {
        viewModel(ctx) {
          ctx.addBeforeNavigateCallback((done) => done(!block))
        }
      })

      ko.components.register('async-promise', {
        viewModel(ctx) {
          ctx.addBeforeNavigateCallback(() => Promise.resolve(!block))
        }
      })

      let hit = false

      ko.components.register('nested', {
        template: '<ko-component-router params="routes: routes"></ko-component-router>',
        viewModel(ctx) {
          this.routes = {
            '/': 'nested-child'
          }
          ctx.addBeforeNavigateCallback(() => {
            t.ok(hit, 'callbacks are called sequentially from bottom => top')
          })
        }
      })

      ko.components.register('nested-child', {
        viewModel(ctx) {
          ctx.addBeforeNavigateCallback((done) => {
            setTimeout(() => {
              hit = true
              done()
            }, 200)
          })
        }
      })

      await Router.update('/sync')
      block = true
      t.notOk(await Router.update('/'), 'returning false should prevent navigation')
      block = false
      t.ok(await Router.update('/'), 'returning !false should not prevent navigation')

      await Router.update('/async-callback')
      block = true
      t.notOk(await Router.update('/'), 'calling the callback with false should prevent navigation')
      block = false
      t.ok(await Router.update('/'), 'calling the callback with !false should not prevent navigation')

      await Router.update('/async-promise')
      block = true
      t.notOk(await Router.update('/'), 'returning a promise that resolves false should prevent navigation')
      block = false
      t.ok(await Router.update('/'), 'returning a promise that resolves !false should prvent navigation')

      await Router.update('/nested')
      await Router.update('/')
    }

    dispose() {
      ko.components.unregister('empty')
      ko.components.unregister('sync')
      ko.components.unregister('async-callback')
      ko.components.unregister('async-promise')
      ko.components.unregister('nested')
      ko.components.unregister('nested-child')
      ko.components.unregister('before-navigate-callbacks')
    }
  }
})
