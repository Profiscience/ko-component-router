import ko from 'knockout'

const anchors = [
  'absolute-a',
  'relative-b'
]

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
    <a id="absolute-a" href="/a"></a>
    <ko-component-router params="routes: routes"></ko-component-router>

    <a id="x-origin" href="http://example.com:8080"></a>
    <a id="download" download></a>
    <a id="empty-hash" href="#"></a>
    <a id="mail-to" href="mailto:notcaseywebb@gmail.com"></a>
    <a id="external" rel="external"></a>
    <a id="target" target="_blank"></a>
  `,
  viewModel: class AnchorTest {
    constructor({ t, next: _next }) {
      const runner = this.runTests(_next)
      const next = runner.next.bind(runner)

      this.routes = {
        '/': 'empty',
        '/a': 'a',
        '/b': 'b'
      }

      ko.components.register('empty', { template: '<div></div>' })

      ko.components.register('a', {
        template: '<a id="relative-b" href="b"></a>',
        viewModel() {
          t.pass('can handle anchors with absolute paths')
          next()
        }
      })

      ko.components.register('b', {
        template: '<div></div>',
        viewModel() {
          t.pass('can handle anchors with relative paths')
          next()
        }
      })

      this.clickHandler = (e) => {
        if (!e.defaultPrevented) {
          t.ok(ignoredAnchors.indexOf(e.target.id) > -1, `ignores ${e.target.id} anchors`)
          e.preventDefault()
          next()
        }
      }

      window.addEventListener('click', this.clickHandler)

      setTimeout(() => next())
    }

    * async runTests(next) {
      const begin = location.href

      history.replaceState(null, null, '/')

      for (const anchor of [...anchors, ...ignoredAnchors]) {
        yield document.getElementById(anchor).click()
      }

      history.pushState(null, null, begin)

      next()
    }

    dispose() {
      ko.components.unregister('empty')
      ko.components.unregister('a')
      ko.components.unregister('b')
      document.removeEventListener('click', this.clickHandler)
    }
  }
})
