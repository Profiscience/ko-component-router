import { map } from 'lodash-es'
import ko from 'knockout'

import { Router } from '../dist/test'

const ignoredAnchors = [
  'x-origin',
  'download',
  'empty-hash',
  'mail-to',
  'external',
  'target'
]

ko.components.register('anchor', {
  template: `
    <ko-component-router></ko-component-router>

    <a id="x-origin" href="http://example.com:8080"></a>
    <a id="download" download></a>
    <a id="empty-hash" href="#"></a>
    <a id="mail-to" href="mailto:notcaseywebb@gmail.com"></a>
    <a id="external" rel="external"></a>
    <a id="target" target="_blank"></a>
  `,
  viewModel: class AnchorTest {
    constructor({ t, done }) {
      Router.useRoutes({
        '/': 'root',
        '/a': 'a',
        '/b': 'b'
      })

      ko.components.register('root', {
        template: '<a id="absolute-a" href="/a"></a>',
        viewModel: class {
          constructor() {
            ko.tasks.schedule(() => document.getElementById('absolute-a').click())
          }
        }
      })

      ko.components.register('a', {
        template: '<a id="relative-b" href="b"></a>',
        viewModel: class {
          constructor() {
            t.pass('can handle anchors with absolute paths')
            ko.tasks.schedule(() => document.getElementById('relative-b').click())
          }
        }
      })

      ko.components.register('b', {
        viewModel: class {
          constructor() {
            t.pass('can handle anchors with relative paths')
            ko.tasks.schedule(() => map(ignoredAnchors, (id) => document.getElementById(id).click()))
          }
        }
      })

      let count = 0
      this.clickHandler = (e) => {
        if (!e.defaultPrevented) {
          t.ok(ignoredAnchors.indexOf(e.target.id) > -1, `ignores ${e.target.id} anchors`)
          e.preventDefault()

          if (++count === ignoredAnchors.length) {
            document.removeEventListener('click', this.clickHandler)
            done()
          }
        }
      }
      window.addEventListener('click', this.clickHandler)
    }
  }
})
