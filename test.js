import history from 'html5-history-api'
import promise from 'es6-promise'
import raf from 'raf'
if (history.emulate) {
  history.redirect('!/', '')
}
if (!window.Promise) {
  promise.polyfill()
}
if (!window.requestAnimationFrame) {
  raf.polyfill()
}

import $ from 'jquery'; window.$ = window.jQuery = $
import ko from 'knockout'
import test from 'tape'
import { renderHtml } from 'ko-component-tester'

import './src'

ko.options.deferUpdates = true

test('ko-component-router', async (t) => { // eslint-disable-line
  const NUM_TESTS_PER_SUITE = 72
  const NUM_CONFIGS = 4
  const NUM_TESTS = NUM_TESTS_PER_SUITE * NUM_CONFIGS + 4
  t.plan(NUM_TESTS)

  t.assert(ko.components.isRegistered('ko-component-router'), 'should register <ko-component-router />')
  t.ok(ko.bindingHandlers.path, 'should register path binding')
  t.ok(ko.bindingHandlers.state, 'should register state binding')
  t.ok(ko.bindingHandlers.query, 'should register query binding')

  await runTests(t, { hashbang: false, base: '' })
  await runTests(t, { hashbang: false, base: '/base' })
  await runTests(t, { hashbang: true, base: '' })
  await runTests(t, { hashbang: true, base: '/base' })
})

async function runTests(t, config) {
  t.comment(JSON.stringify(config))

  if (!history.emulate) {
    history.pushState(null, null, config.base + (config.hashbang ? '/#!' : '') + '/about')
  } else {
    t.comment('history api is being emulated... config.base is being ignored...')
    config.base = window.location.pathname
    window.location.hash = '#!/about'
  }

  const $dom = renderHtml({
    viewModel: class {
      constructor() {
        this.config = config
        this.routes = {
          // explicit path
          '/about': 'about',

          // one required param (`name`)
          // one optional param (`operation`)
          '/user/:name/:operation?': 'user',

          // route w/ nested router
          '/nested/!': 'nested',
          '/another-nested/!': 'nested',

          // various test components
          '/bindings': 'bindings',
          '/anchors': 'anchors',

          // named wildcard segment
          '/file/:file(*)': 'file',

          // persistQuery & persistState options
          '/persistent/!': 'persistent-query-state',

          '/navigate-callback/!': 'navigate-callback',

          '/route-pipeline': [
            (ctx) => {
              ctx.syncCalled = true
            },
            (ctx, done) => {
              setTimeout(() => {
                ctx.callbackCalled = true
                t.false(ctx.promiseCalled)
                done()
              }, 300)
            },
            (ctx) => new Promise((resolve) => {
              setTimeout(() => {
                ctx.promiseCalled = true
                t.true(ctx.callbackCalled)
                resolve()
              }, 200)
            }),
            'route-pipeline'
          ],

          '/meta/:id': [(ctx) => ctx.route.component = 'meta'],

          // wildcard segment
          '/*': '404'
        }
      }
    },
    template: `
      <ko-component-router params="
        routes: routes,
        base: config.base,
        hashbang: config.hashbang
      ">
      </ko-component-router>
    `
  })

  let router

  // init
  await step(() => {
    router = $dom.$context().$router
  })

  // routing
  await step(() => {
    t.equal(router.route().component, 'about', 'explicit path (and initialization)')
    router.update('/user/casey/')
  })
  await step((done) => {
    t.equal(router.route().component, 'user', 'routes w/ missing optional parameter')
    t.equal(router.params.name(), 'casey', 'attaches required param to ctx.params[PARAM_NAME]')
    t.equal(router.params.operation(), undefined, 'optional param is `undefined` when missing')

    const killMe = router.params.name.subscribe((n) => {
      t.equal(n, 'barsh', 'ctx.params[PARAM_NAME] is subscribable')
      killMe.dispose()
      done()
    })

    router.update('/user/barsh/')
  })
  await step(() => {
    router.update('/user/casey/edit')
  })
  await step(() => {
    t.equal(router.params.operation(), 'edit', 'attaches optional param to ctx.params[PARAM_NAME]')
    router.update('/user/barsh')
  })
  await step(() => {
    t.equal(router.params.operation(), undefined, 'optional param on ctx.params[PARAM_NAME] gets set to undefined when navigated away from')
    router.update('/this/page/does/not/exist')
  })
  await step(() => {
    t.equal(router.route().component, '404', 'asterisk route catches 404s')
    router.update('/file/foo/bar.zip')
  })
  await step(() => {
    t.equal(router.params.file(), 'foo/bar.zip', 'named wildcard routes are attaches to ctx.params[PARAM_NAME]')
  })

  // nested routing
  await step(() => {
    router.update('/nested/foo')
    ko.tasks.runEarly()
  })
  // path binding is applied asynchronously
  // this is by design, not a hack to get passing tests
  await step((done) => ko.tasks.schedule(done))
  await step(() => {
    const nestedRouter = ko.contextFor($('ko-component-router', $dom).get(0)).$router
    const link = $('#nested-bar', $dom).get(0)
    t.equal(nestedRouter.route().component, 'nested-foo', 'nested routing works')
    link.click()
  })
  await step((done) => window.requestAnimationFrame(done))
  await step(() => {
    const nestedRouter = ko.contextFor($('ko-component-router', $dom).get(0)).$router
    const link = $('#another-nested-foo', $dom).get(0)
    t.equal(nestedRouter.route().component, 'nested-bar', 'path binding works in nested router within same context')
    link.click()
  })
  await step((done) => ko.tasks.schedule(done))
  await step(() => {
    const nestedRouter = ko.contextFor($('ko-component-router', $dom).get(0)).$router
    const link = $('#parent-about', $dom).get(0)
    t.deepEquals(nestedRouter.query.getAll(), { fromBar: true }, 'query binding passes query down nested routers')
    t.deepEquals(nestedRouter.state(), { fromBar: true }, 'state binding passes state down nested routers')
    link.click()
  })
  await step(() => {
    t.equal(router.route().component, 'about', 'path binding traverses routers if not found')
  })

  // hash
  await step(() => {
    router.update('/about#foobar')
  })
  await step(() => {
    t.equal(router.hash(), 'foobar', 'hash is attached to ctx.hash()')
  })

  // state
  await step(() => {
    router.update(undefined, { foo: 'foo' })
  })
  await step(() => {
    t.deepEqual(router.state(), { foo: 'foo' }, 'router.update can set state')
  })

  // query
  await step(() => {
    router.update('/about', {}, false, { foo: 'foo', bazs: ['1', '2', '3'], quxs: ['1', '2', '3'] })
    router.query.get('foo', 'foo')
  })

  await step(() => {
    router.query.setDefaults({ bar: 'bar' })
    router.query.setDefaults({ bazs: [] }, (vs) => vs.map((v) => parseInt(v)))
    router.query.get('quxs', [], (vs) => vs.map((v) => parseInt(v)))

    const foo = router.query.get('foo', 'foo')
    const query = router.query.getAll()
    const observableQuery = router.query.getAll(true)

    t.equal(foo(), 'foo', 'ctx.query.get works')
    t.deepEqual(query, { foo: 'foo', bar: 'bar', bazs: [1, 2, 3], quxs: [1, 2, 3]  }, 'ctx.query.getAll works')
    t.assert(ko.isObservable(observableQuery), 'ctx.query.getAll(true) returns as observable')
    t.deepEqual(observableQuery(), { foo: 'foo', bar: 'bar', bazs: [1, 2, 3], quxs: [1, 2, 3] })
    t.equal(router.query.get('bar')(), 'bar', 'ctx.query.setDefaults works')
    t.deepEqual(router.query.get('bazs')(), [1,2,3], 'ctx.query.get parsing works')
    t.deepEqual(router.query.get('quxs')(), [1,2,3], 'ctx.query.setDefaults parsing works')
  })
  await step((done) => {
    const observableQuery = router.query.getAll(true)
    const killMe = observableQuery.subscribe(() => {
      killMe.dispose()
      t.pass('ctx.query.getAll(true) is subscribable')
      observableQuery({ bar: 'bar', baz: 'baz' })
      done()
    })
    router.query.get('bar')('qux')
  })
  await step(() => {
    const query = router.query.getAll()
    t.deepEqual(query, { foo: 'foo', bar: 'bar', baz: 'baz', bazs: [1,2,3], quxs: [1,2,3] }, 'ctx.query.getAll(true) is writable')
    router.update('/about', {}, false, { foo: 'bar' })
  })
  await step((done) => {
    const foo = router.query.get('foo', 'foo')
    t.equal(foo(), 'bar', 'querystring param is writeable')
    t.ok(decodeURIComponent(window.location.href).indexOf('[foo]=bar') > -1, 'non-default params are written to the querystring')

    const killMe = foo.subscribe(() => {
      t.equal(router.query.get('foo')(), 'foo', 'ctx.query.clear sets the params to defaults')
      t.ok(window.location.href.indexOf('%5Bfoo%5D=foo') < 0, 'default params are not in the querystring')
      killMe.dispose()
      done()
    })

    router.query.clear()
  })
  await step((done) => {
    const baz = router.query.get('baz')

    const killMe = baz.subscribe(() => {
      t.deepEqual(router.query.getAll(), {
        foo: 'bar',
        bar: 'bar',
        baz: 'qux',
        bazs: [],
        quxs: []
      }, 'ctx.query.update works')
      killMe.dispose()
      done()
    })

    router.query.update({
      foo: 'bar',
      baz: 'qux'
    })
  })

  // bindings
  await step(() => {
    router.update('/bindings')
  })
  // path binding is applied asynchronously so that links that occur before
  // the router in the $dom can use the bindings
  //
  // this is by design and not a hack to get passing tests
  await step((done) => window.requestAnimationFrame(done))
  await step(() => {
    const link = $('#all-bindings-anchor', $dom).get(0)
    link.click()
  })
  await step(() => {
    t.equal(router.route().component, 'about', 'path binding navigates (used together)')
    t.deepEqual(router.state(), { foo: 'foo' }, 'state binding sets state (used together)')
    t.deepEqual(router.query.getAll(), { bar: 'bar' }, 'query binding sets query (used together)')
  })
  await step(() => {
    router.update('/bindings', {}, false, { bar: 'bar' })
  })
  await step((done) => window.requestAnimationFrame(done))
  await step(() => {
    const link = $('#state-binding-anchor', $dom).get(0)
    link.click()
  })
  await step(() => {
    t.equal(router.route().component, 'bindings', 'state binding persistents path when used alone')
    t.deepEqual(router.state(), { foo: 'foo' }, 'state binding sets state when used alone')
    t.deepEqual(router.query.getAll(), { bar: 'bar' }, 'state binding persists query when used alone')
  })
  await step(() => {
    router.reload()
    router.update('/bindings', { bar: 'bar' }, false, { })
  })
  await step((done) => window.requestAnimationFrame(done))
  await step(() => {
    const link = $('#query-binding-anchor', $dom).get(0)
    link.click()
  })
  await step(() => {
    t.equal(router.route().component, 'bindings', 'query binding persistents path when used alone')
    t.deepEqual(router.state(), { bar: 'bar' }, 'query binding persists state when used alone')
    t.deepEqual(router.query.getAll(), { bar: 'bar' }, 'query binding sets query when used alone')
  })
  await step(() => {
    const activeLink = $('#should-be-active', $dom)
    t.ok(activeLink.hasClass('active-path'), 'path binding sets `active` class')
  })

  // anchors
  await step(() => {
    router.update('/anchors')
  })
  await step(() => {
    const aboutLink = $('#about-link', $dom).get(0)
    aboutLink.click()
  })
  await step(() => {
    t.equal(router.route().component, 'about', 'clicking a link navigates')
  })
  await step(() => {
    router.update('/anchors')
  })
  await step(() => {
    $('body').append($('#ignored-links', $dom))

    let count = 0
    $('body').on('click', (e) => {
      count++
      e.preventDefault()
    })

    $('#ignored-links *').each((i, el) => {
      el.click()
    })

    t.equal(count, $('#ignored-links *').length, 'ignores appropriate links')
  })

  // persistQuery & persistState
  await step(() => {
    router.update('/persistent/foo')
  })
  await step(() => {
    const persistentRouter = ko.contextFor($('ko-component-router', $dom).get(0)).$router
    persistentRouter.state({ foo: 'foo' })
    persistentRouter.query.get('foo')('foo')
    persistentRouter.update('/bar')
  })
  await step(() => {
    const persistentRouter = ko.contextFor($('ko-component-router', $dom).get(0)).$router
    t.equals(persistentRouter.state(), undefined)
    t.deepEquals(persistentRouter.query.getAll(), {})
    t.equals(persistentRouter.route().component, 'bar')
    persistentRouter.update('/foo')
  })
  await step(() => {
    const persistentRouter = ko.contextFor($('ko-component-router', $dom).get(0)).$router
    t.deepEqual(persistentRouter.state(), { foo: 'foo' }, 'persistState works')
    t.equals(persistentRouter.query.get('foo')(), 'foo', 'persistQuery works')
    t.equals(persistentRouter.route().component, 'foo')
  })

  // addBeforeNavigateCallback
  let parentCallbackCalled
  let isFirstTime = true
  await step(() => {
    ko.components.register('navigate-callback', {
      template: '<ko-component-router params="routes: routes"></ko-component-router>',
      viewModel: class {
        constructor(ctx) {
          this.routes = {
            '/': 'empty-component',
            '/nested-navigate-callback': 'nested-navigate-callback'
          }

          ctx.addBeforeNavigateCallback(() => {
            parentCallbackCalled = true
            if (isFirstTime) {
              t.pass('functions registered with addBeforeNavigateCallback get called')
              isFirstTime = false
              return false
            }
          })
        }
      }
    })
    ko.components.register('nested-navigate-callback', {
      template: '<div></div>',
      viewModel: class {
        constructor(ctx) {
          let secondCallbackCalled
          ctx.addBeforeNavigateCallback((done) => {
            if (isFirstTime) {
              setTimeout(() => {
                t.false(secondCallbackCalled, 'addBeforeNavigateCallbacks are ran FIFO and sequentially')
                done()
              }, 100)
            } else {
              done()
            }
          })
          ctx.addBeforeNavigateCallback(() => {
            secondCallbackCalled = true
            if (isFirstTime) {
              t.pass('functions registered with addBeforeNavigateCallback in child routers get called when the parent navigates')
              t.false(parentCallbackCalled, 'addBeforeNavigateCallbacks in child routers get called first')
            }
          })
        }
      }
    })
    ko.components.register('empty-component', { template: '<span></span>' })
    router.update('/navigate-callback/nested-navigate-callback')
  })
  await step((done) => {
    const willUpdate = router.update('/about')
    willUpdate.then((didUpdate) => {
      t.false(didUpdate, 'addBeforeNavigateCallback prevents navigation when return === false')
      done()
    })
  })
  await step((done) => {
    t.equal(router.route().component, 'navigate-callback')
    const willUpdate = router.update('/about')
    willUpdate.then((didUpdate) => {
      t.true(didUpdate, 'addBeforeNavigateCallback does not prevent navigation when return !== false')
      done()
    })
  })
  await step(() => {
    t.equal(router.route().component, 'about', 'addBeforeNavigateCallback does not prevent navigation when return !== false')
    ko.components.unregister('navigate-callback')
    ko.components.unregister('nested-navigate-callback')
    ko.components.unregister('empty-component')
  })

  // addBeforeNavigateCallback callback
  await step(() => {
    ko.components.register('navigate-callback', {
      template: '<div></div>',
      viewModel: class {
        constructor(ctx) {
          let isFirstTime = true
          ctx.addBeforeNavigateCallback((done) => {
            if (isFirstTime) {
              isFirstTime = false
              done(false)
            } else {
              done()
            }
          })
        }
      }
    })
    router.update('/navigate-callback')
  })
  await step((done) => {
    const willUpdate = router.update('/about')
    willUpdate.then((didUpdate) => {
      t.false(didUpdate, 'addBeforeNavigateCallback prevents navigation when callback(false)')
      done()
    })
  })
  await step((done) => {
    t.equal(router.route().component, 'navigate-callback', 'addBeforeNavigateCallback prevents navigation when callback(false)')
    const willUpdate = router.update('/about')
    willUpdate.then((didUpdate) => {
      t.true(didUpdate, 'addBeforeNavigateCallback does not prevent navigation when callback(!false)')
      done()
    })
  })
  await step(() => {
    t.equal(router.route().component, 'about', 'addBeforeNavigateCallback does not prevent navigation when callback(!false)')
    ko.components.unregister('navigate-callback')
  })

  // addBeforeNavigateCallback promise
  await step(() => {
    ko.components.register('navigate-callback', {
      template: '<div></div>',
      viewModel: class {
        constructor(ctx) {
          let isFirstTime = true
          ctx.addBeforeNavigateCallback(() => {
            return new Promise((resolve) => {
              if (isFirstTime) {
                isFirstTime = false
                resolve(false)
              } else {
                resolve()
              }
            })
          })
        }
      }
    })
    router.update('/navigate-callback')
  })
  await step((done) => {
    const willUpdate = router.update('/about')
    willUpdate.then((didUpdate) => {
      t.false(didUpdate)
      done()
    })
  })
  await step((done) => {
    t.equal(router.route().component, 'navigate-callback', 'addBeforeNavigateCallback prevents navigation when Promise.resolve(false)')
    const willNavigate = router.update('/about')
    willNavigate.then((didNavigate) => {
      t.true(didNavigate)
      done()
    })
  })
  await step(() => {
    t.equal(router.route().component, 'about', 'addBeforeNavigateCallback does not prevent navigation when Promise.resolve(!false)')
    ko.components.unregister('navigate-callback')
  })

  // route pipeline
  await step((done) => {
    ko.components.register('route-pipeline', {
      template: '<div></div>',
      viewModel: class {
        constructor(ctx) {
          t.true(ctx.syncCalled)
          t.true(ctx.callbackCalled)
          t.true(ctx.promiseCalled)
        }
      }
    })
    router.update('/route-pipeline')
    const killMe = router.route.subscribe(() => {
      killMe.dispose()
      t.equal(router.route().component, 'route-pipeline')
      router.update('/about')
      done()
    })
  })
  await step(() => {
    ko.components.unregister('route-pipeline')
  })

  // route pipeline meta programability
  await step(() => {
    ko.components.register('meta', {
      template: '<div></div>',
      viewModel: class {
        constructor(ctx) {
          ctx.forceReloadOnParamChange()
          if (ctx.params.id() === '1') {
            t.pass('meta programability with route callbacks works')
          } else if (ctx.params.id() === '2') {
            t.pass('ctx.forceReloadOnParamChange works')
          }
        }
      }
    })
    router.update('/meta/1')
  })
  await step(() =>
    router.update('/meta/2')
  )
  await step(() => {
    ko.components.unregister('meta')
  })
}

ko.components.register('about',   { synchronous: true, template: 'ABOUT' })
ko.components.register('user',    { synchronous: true, template: 'USER' })
ko.components.register('404',     { synchronous: true, template: '404' })
ko.components.register('file',    { synchronous: true, template: 'FILE' })
ko.components.register('bindings', {
  synchronous: true,
  template: `
    BINDINGS
    <a id="should-be-active" data-bind="path: \'/bindings\'"></a>
    <a id="all-bindings-anchor" data-bind="path: \'/about\', state: { foo: 'foo' }, query: { bar: 'bar' }"></a>
    <a id="path-binding-anchor" data-bind="path: \'/about\'"></a>
    <a id="state-binding-anchor" data-bind="state: { foo: 'foo' }"></a>
    <a id="query-binding-anchor" data-bind="query: { bar: 'bar' }"></a>
  `
})
ko.components.register('anchors', {
  synchronous: true,
  template: `
    <a id="about-link" data-bind="attr: { href: $router.config.base + '/about' }"></a>
    <div id="ignored-links">
      <button id="not-a-link"></button>
      <a download="/foo"></a>
      <a target="_blank"></a>
      <a rel="external"></a>
      <a href="mailto:foobar@example.com"></a>
      <a href="http://example.com/"></a>
      <a href="#"></a>
    </div>
  `
})
ko.components.register('nested-foo', {
  synchronous: true,
  template: `
    <a id="nested-bar" data-bind="path: \'/bar\'"></a>
    <a id="parent-about" data-bind="path: \'/about\'"></a>
  `
})
ko.components.register('nested-bar', {
  synchronous: true,
  template: `
    <a id="another-nested-foo" data-bind="path: \'/another-nested/foo\', query: { fromBar: true }, state: { fromBar: true }"></a>
  `
})
ko.components.register('nested',  {
  synchronous: true,
  template: 'NESTED <ko-component-router params="routes: routes"></ko-component-router>',
  viewModel: class Nested {
    constructor() {
      this.routes = {
        '/foo': 'nested-foo',
        '/bar': 'nested-bar'
      }
    }
  }
})
ko.components.register('foo', { synchronous: true, template: '<h1>foo</h1>' })
ko.components.register('bar', { synchronous: true, template: '<h1>bar</h1>' })
ko.components.register('persistent-query-state', {
  synchronous: true,
  template: `
    <ko-component-router params="
      routes: routes,
      persistState: true,
      persistQuery: true
    "></ko-component-router>
  `,
  viewModel: class Tabs {
    constructor() {
      this.routes = {
        '/foo': 'foo',
        '/bar': 'bar'
      }
    }
  }
})

async function step(fn) { // eslint-disable-line require-yield
  return new Promise((resolve) => {
    ko.tasks.schedule(() => {
      if (fn.length === 1) {
        fn(resolve)
      } else {
        fn()
        resolve()
      }
    })
  })
}
