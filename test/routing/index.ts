import ko from 'knockout'
import { extend, mapValues } from 'lodash'

import Router from '../../src'

import init from './init'
import basic from './basic'
// import params from './params'
// import nested from './nested'
// import similar from './similar'
// import ambiguous from './ambiguous'
// import _static from './static'

const paths = [
  '/basic',
  // '/params/foo',
  // '/nested/a',
  // '/similar/foo/bar',
  // '/ambiguous/a/b/c',
  // '/static'
]

ko.components.register('routing', {
  template: '<ko-component-router params="routes: routes"></ko-component-router>',
  viewModel: class RoutingTestSuite {
    constructor({ t, next: _next }) {
      const runner = this.runTests(_next)
      const next = runner.next.bind(runner)

      this.routes = mapValues({
        ...init,
        ...basic,
        ...params,
        ...nested,
        ...similar,
        ...ambiguous
      }, (r) => [
        (ctx) => extend(ctx, { t, next }),
        r
      ])

      Router.useRoutes(mapValues({
        ..._static
      }, (r) => [
        (ctx) => extend(ctx, { t, next }),
        r
      ]))

      next()
    }

    * async runTests(next) {
      const begin = location.href

      yield history.pushState(null, null, '/init')

      for (const path of paths) {
        yield Router.update(path)
      }

      history.pushState(null, null, begin)
      next()
    }
  }
})
