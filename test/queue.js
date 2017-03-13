import ko from 'knockout'

import Router from '../dist/modules'

ko.components.register('queue', {
  template: '<ko-component-router></ko-component-router>',
  viewModel: class QueueTest {
    constructor({ t, done }) {
      let queuedPromiseResolved = false

      Router.useRoutes = {
        '/': ['foo',
          (ctx) =>
            ctx.queue(new Promise((resolve) => {
              setTimeout(() => {
                queuedPromiseResolved = true
                resolve()
              }, 1000)
            })),
          () => {
            t.notOk(queuedPromiseResolved, 'queued promises let middleware continue')
          }
        ]
      }

      ko.components.register('foo', {
        viewModel: class {
          constructor() {
            t.ok(queuedPromiseResolved, 'queued promise resolves before component render')
            done()
          }
        }
      })

      history.replaceState(null, null, '/')
    }
  }
})
