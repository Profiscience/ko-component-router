import { random } from 'lodash-es'
import ko from 'knockout'
import Router from 'ko-component-router'
import loadingMiddleware from './middleware/loading'

import * as foo from './views/foo'
import * as bar from './views/bar'

const loading = ko.observable(true)

Router.setConfig({ base: '/loading-animation', hashbang: true })

// pass loading observable into middleware
Router.use(loadingMiddleware(loading))

Router.useRoutes({
  '/': (ctx) => ctx.redirect('/foo'),

  // simulate a deeply nested route w/ timeouts (would be ajax or what have you
  // in real life)
  '/foo': [
    randomTimeout,
    {
      '/': [
        randomTimeout,
        {
          '/': [
            randomTimeout,
            {
              '/': [
                randomTimeout,
                {
                  '/': [
                    randomTimeout,
                    {
                      '/': 'foo'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  '/bar': 'bar'
})

ko.components.register('app', { template: '<ko-component-router></ko-component-router>' })
ko.components.register('foo', foo)
ko.components.register('bar', bar)

// loader is in html, so that it is visible on page load before/while scripts
// are parsed and the app initializes
ko.applyBindings({ loading })

function randomTimeout() {
  return new Promise((resolve) => setTimeout(resolve, random(1000)))
}
