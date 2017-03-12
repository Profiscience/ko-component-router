import ko from 'knockout'
import { flatMap, extend } from 'lodash-es'

import Router from '../../dist/modules'

import * as init from './init'
import * as basic from './basic'

import * as params from './params'
import * as nested from './nested'
import * as similar from './similar'
import * as ambiguous from './ambiguous'

const tests = [
  init,
  basic,
  params,
  nested,
  similar,
  ambiguous
]

// const paths = [
//   // '/params/foo',
//   // '/nested/a',
//   // '/similar/foo/bar',
//   // '/ambiguous/a/b/c'
// ]

const paths = flatMap(tests, 'paths')

ko.components.register('routing', {
  template: '<ko-component-router></ko-component-router>',
  viewModel: class RoutingTestSuite {
    constructor({ t, done }) {
      Router.useRoutes(extend({}, flatMap(tests, 'routes')))
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
