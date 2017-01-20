import ko from 'knockout'

ko.components.register('queue', {
  template: '<ko-component-router params="routes: routes"></ko-component-router>',
  viewModel: class QueueTest {
    constructor({ t, next }) {
      let queuedPromiseResolved = false

      this.routes = {
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
        viewModel: () => {
          t.ok(queuedPromiseResolved, 'queued promise resolves before component render')
          next()
        }
      })

      history.replaceState(null, null, '/')
    }

    dispose() {
      ko.components.unregister('queue')
      ko.components.unregister('foo')
    }
  }
})
