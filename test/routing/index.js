import ko from 'knockout'
import { extend, map } from 'lodash-es'

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

const paths = map(tests, 'path')

ko.components.register('routing', {
  template: '<ko-component-router></ko-component-router>',
  viewModel: class RoutingTestSuite {
    constructor({ t, done }) {
      Router.useRoutes(extend({}, ...map(tests, 'routes')))
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
