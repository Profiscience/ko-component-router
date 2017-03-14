import ko from 'knockout'

import Router from '../dist/modules'

ko.components.register('before-navigate-callbacks', {
  template: '<ko-component-router></ko-component-router>',
  viewModel: class BeforeNavigateCallbackTest {
    constructor({ t, done }) {
      Router.useRoutes({
        '/': 'empty',
        '/sync': 'sync',
        '/async-callback': 'async-callback',
        '/async-promise': 'async-promise',
        '/nested': ['nested',
          {
            '/': 'nested-child'
          }]
      })

      ko.components.register('empty', {})

      setTimeout(() => this.runTests(t).then(done))
    }

    async runTests(t) {
      let block

      history.replaceState(null, null, '/sync')

      ko.components.register('sync', {
        viewModel: class {
          constructor(ctx) {
            ctx.addBeforeNavigateCallback(() => !block)
          }
        }
      })

      ko.components.register('async-callback', {
        viewModel: class {
          constructor(ctx) {
            ctx.addBeforeNavigateCallback((done) => done(!block))
          }
        }
      })

      ko.components.register('async-promise', {
        viewModel: class {
          constructor(ctx) {
            ctx.addBeforeNavigateCallback(() => Promise.resolve(!block))
          }
        }
      })

      let hit = false

      ko.components.register('nested', {
        template: '<ko-component-router></ko-component-router>',
        viewModel: class {
          constructor(ctx) {
            ctx.addBeforeNavigateCallback(() => {
              t.ok(hit, 'callbacks are called sequentially from bottom => top')
            })
          }
        }
      })

      ko.components.register('nested-child', {
        viewModel: class {
          constructor(ctx) {
            ctx.addBeforeNavigateCallback((done) => {
              setTimeout(() => {
                hit = true
                done()
              }, 200)
            })
          }
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
  }
})
