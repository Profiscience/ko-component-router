import ko from 'knockout'
import Router from '../dist/modules'

ko.components.register('middleware', {
  template: '<ko-component-router params="routes: routes"></ko-component-router>',
  viewModel: class MiddlewareTest {
    constructor({ t, next: _next }) {
      const runner = this.runTests(_next)
      const next = runner.next.bind(runner)

      t.ok(Router, 'should attach Router.use after import for middleware')

      Router.use(function * (ctx) {
        ctx.beforeRenderGlobalMiddlewareHit = true
        yield
        ctx.afterRenderGlobalMiddlewareHit = true
        yield
        ctx.beforeDisposeGlobalMiddlewareHit = true
        yield
        ctx.afterDisposeGlobalMiddlewareHit = true
      })

      this.routes = {
        '/': 'empty',

        '/sync': [
          (ctx) => {
            t.ok(ctx, 'middleware is ran with ctx as first argument')
          },
          () => next()
        ],

        '/async': [
          (ctx, next) => {
            setTimeout(() => {
              ctx.waitOver = true
              next()
            }, 200)
          },
          (ctx) => {
            t.ok(ctx.waitOver, 'async middleware works with done callback')
            ctx.waitOver = false
            return new Promise((resolve) => {
              setTimeout(() => {
                ctx.waitOver = true
                resolve()
              })
            })
          },
          (ctx) => {
            t.ok(ctx.waitOver, 'async middleware works with promise')
            ctx.waitOver = false

            next()
          }
        ],

        '/generator': [
          function * (ctx) {
            t.pass('generator middleware is called')

            t.ok(ctx.beforeRenderGlobalMiddlewareHit, 'global middleware before render middleware is executed')
            t.ok(ctx.beforeRenderGlobalMiddlewareHit, 'route before before render middleware is called after global before render middleware')

            yield new Promise((resolve) => {
              setTimeout(() => {
                ctx.waitOver = true
                resolve()
              }, 200)
            })

            t.ok(ctx.afterRenderGlobalMiddlewareHit, 'route after render middleware is called after global after render middleware')

            yield

            t.ok(ctx.beforeNavigateHit, 'before dispose middleware is called after before navigate callbacks')
            t.notOk(ctx.beforeDisposeGlobalMiddlewareHit, 'route before dispose middleware is called before global before dispose middleware')

            yield

            t.notOk(ctx.afterDisposeGlobalMiddlewareHit, 'route after dispose middleware is called before global after dispose middleware')
          },
          (ctx) => {
            t.ok(ctx.waitOver, 'generator middleware works with yield-ed promise')
          },
          'generator'
        ],

        '/object': [
          (ctx) => ({
            beforeRender() {
              t.pass('object middleware is called')

              t.ok(ctx.beforeRenderGlobalMiddlewareHit, 'global middleware before render middleware is executed')
              t.ok(ctx.beforeRenderGlobalMiddlewareHit, 'route before before render middleware is called after global before render middleware')

              return new Promise((resolve) => {
                setTimeout(() => {
                  ctx.promiseWaitOver = true
                  resolve()
                }, 200)
              })
            },
            afterRender(done) {
              t.ok(ctx.afterRenderGlobalMiddlewareHit, 'route after render middleware is called after global after render middleware')

              setTimeout(() => {
                ctx.callbackWaitOver = true
                done()
              }, 200)
            },
            beforeDispose() {
              t.ok(ctx.beforeNavigateHit, 'before dispose middleware is called after before navigate callbacks')
              t.notOk(ctx.beforeDisposeGlobalMiddlewareHit, 'route before dispose middleware is called before global before dispose middleware')
            },
            afterDispose() {
              t.notOk(ctx.afterDisposeGlobalMiddlewareHit, 'route after dispose middleware is called before global after dispose middleware')
            }
          }),
          (ctx) => ({
            beforeRender() {
              t.ok(ctx.promiseWaitOver, 'object middleware works with returned promise')
            },
            afterRender() {
              t.ok(ctx.callbackWaitOver, 'object middleware works with callback')
            }
          }),
          'object'
        ]
      }

      ko.components.register('empty', { })

      ko.components.register('generator', {
        viewModel: (ctx) => {
          ctx.addBeforeNavigateCallback(() => ctx.beforeNavigateHit = true)
          next()
        }
      })
      
      ko.components.register('object', {
        viewModel: (ctx) => {
          ctx.addBeforeNavigateCallback(() => ctx.beforeNavigateHit = true)
          next()
        }
      })

      next()
    }

    * async runTests(next) {
      const begin = location.href

      yield history.replaceState(null, null, '/sync')

      yield Router.update('/async')
      yield Router.update('/generator')
      yield Router.update('/object')

      Router.update('/').then(() => {
        history.pushState(null, null, begin)
        next()
      })
    }

    dispose() {
      ko.components.unregister('empty')
      ko.components.unregister('generator')
      ko.components.unregister('object')
      ko.components.unregister('middleware')
    }
  }
})
