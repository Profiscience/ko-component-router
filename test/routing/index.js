import ko from 'knockout'
import { flatMap, extend } from 'lodash-es'

import Router from '../../dist/modules'

import * as init from './init'
import * as basic from './basic'

// import params from './params'
// import nested from './nested'
// import similar from './similar'
// import ambiguous from './ambiguous'
// import _static from './static'

// const paths = [
//   '/basic',
//   // '/params/foo',
//   // '/nested/a',
//   // '/similar/foo/bar',
//   // '/ambiguous/a/b/c',
//   // '/static'
// ]

const paths = flatMap([init, basic], 'paths')

ko.components.register('routing', {
  template: '<ko-component-router></ko-component-router>',
  viewModel: class RoutingTestSuite {
    constructor({ t, done }) {
      Router.useRoutes(extend({},
        init.routes,
        basic.routes
      ))

      ko.tasks.schedule(() => this.runTests(t).then(done))
    }

    async runTests(t) {
      for (const path of paths) {
        await new Promise((resolve) => {
          Router.update(path, { with: { t, done: resolve } })
        })
      }
    }
  }
})
