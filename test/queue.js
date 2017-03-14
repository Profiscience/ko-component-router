import ko from 'knockout'

import Router from '../dist/modules'

ko.components.register('queue', {
  template: '<ko-component-router></ko-component-router>',
  viewModel: class QueueTest {
    constructor({ t, done }) {
      let queuedPromiseAResolved = false
      let queuedPromiseBResolved = false

      Router.useRoutes({
        '/': [
          (ctx) =>
            ctx.queue(new Promise((resolve) => {
              setTimeout(() => {
                queuedPromiseAResolved = true
                resolve()
              }, 1000)
            })),
          () => {
            t.notOk(queuedPromiseAResolved, 'queued promises let middleware continue')
          },
          {
            '/': ['foo',
              (ctx) =>
                ctx.queue(new Promise((resolve) => {
                  setTimeout(() => {
                    queuedPromiseBResolved = true
                    resolve()
                  }, 1000)
                })),
              () => {
                t.notOk(queuedPromiseAResolved, 'queued promises in parent router does not prevent child middleware from executing')
              }
            ]
          }
        ]
      })

      ko.components.register('foo', {
        viewModel: class {
          constructor() {
            t.ok(queuedPromiseAResolved, 'queued promise in parent router resolves before component render')
            t.ok(queuedPromiseBResolved, 'queued promise in child router resolves before component render')
            done()
          }
        }
      })

      history.replaceState(null, null, '/')
    }
  }
})
