'use strict'

const $ = require('jquery')
const ko = require('knockout')
const test = require('tape')
let foo

// polyfills
require('es6-promise').polyfill()
require('raf').polyfill()

require('./src')

ko.options.deferUpdates = true

function runTests(t, config) {
  return new Promise((resolve) => {
    t.comment(JSON.stringify(config))

    const dom = $(`
      <ko-component-router params="
        routes: routes,
        base: config.base,
        hashbang: config.hashbang
      ">
      </ko-component-router>
    `).get(0)

    if (!history.emulate) {
      history.pushState(null, null, config.base + (config.hashbang ? '/#!' : '') + '/about')
    } else {
      t.comment('history api is being emulated... config.base is being ignored...')
      config.base = window.location.pathname
      window.location.hash = '#!/about'
    }

    ko.applyBindings(new RoutingTest(config), dom)

    let router
    // init
    step(() => {
      router = ko.contextFor(dom).$router
    })

    // routing
    .step(() => {
      t.equal(router.route().component, 'about', 'explicit path (and initialization)')
      router.update('/user/casey/')
    })
    .step(() => {
      t.equal(router.route().component, 'user', 'routes w/ missing optional parameter')
      t.equal(router.params.name(), 'casey', 'attaches required param to ctx.params[PARAM_NAME]')
      t.equal(router.params.operation(), undefined, 'optional param is `undefined` when missing')
      router.update('/user/casey/edit')
    })
    .step(() => {
      t.equal(router.params.operation(), 'edit', 'attaches optional param to ctx.params[PARAM_NAME]')
      router.update('/this/page/does/not/exist')
    })
    .step(() => {
      t.equal(router.route().component, '404', 'asterisk route catches 404s')
      router.update('/file/foo/bar.zip')
    })
    .step(() => {
      t.equal(router.params.file(), 'foo/bar.zip', 'named wildcard routes are attaches to ctx.params[PARAM_NAME]')
    })

    // nested routing
    .step(() => {
      router.update('/nested/foo')
      ko.tasks.runEarly()
    })
    // path binding is applied asynchronously
    // this is by design, not a hack to get passing tests
    .step((done) => ko.tasks.schedule(done))
    .step(() => {
      const nestedRouter = ko.contextFor($('ko-component-router', dom).get(0)).$router
      const link = $('#nested-bar', dom).get(0)
      t.equal(nestedRouter.route().component, 'nested-foo', 'nested routing works')
      link.click()
    })
    .step((done) => window.requestAnimationFrame(done))
    .step(() => {
      const nestedRouter = ko.contextFor($('ko-component-router', dom).get(0)).$router
      const link = $('#parent-about', dom).get(0)
      t.equal(nestedRouter.route().component, 'nested-bar', 'path binding works in nested router within same context')
      link.click()
    })
    .step(() => {
      t.equal(router.route().component, 'about', 'path binding traverses routers if not found')
    })

    // hash
    .step(() => {
      router.update('/about#foobar')
    })
    .step(() => {
      t.equal(router.hash(), 'foobar', 'hash is attached to ctx.hash()')
    })

    // state
    .step(() => {
      router.update(undefined, { foo: 'foo' })
    })
    .step(() => {
      t.deepEqual(router.state(), { foo: 'foo' }, 'router.update can set state')
    })

    // query
    .step(() => {
      router.update('/about', {}, false, { foo: 'foo', bazs: ['1', '2', '3'], quxs: ['1', '2', '3'] })
      router.query.get('foo', 'foo')
    })
    .step(() => {
      router.query.setDefaults({
        bar: 'bar'
      })
      router.query.setDefaults({ bazs: [] }, (vs) => vs.map((v) => parseInt(v)))
      router.query.get('quxs', [], (vs) => vs.map((v) => parseInt(v)))

      const foo = router.query.get('foo', 'foo')
      const query = router.query.getAll()
      const observableQuery = router.query.getAll(true)

      t.equal(foo(), 'foo', 'ctx.query.get works')
      t.deepEqual(query, { foo: 'foo', bazs: [1, 2, 3], quxs: [1, 2, 3]  }, 'ctx.query.getAll works')
      t.assert(ko.isObservable(observableQuery), 'ctx.query.getAll(true) returns as observable')
      t.deepEqual(observableQuery(), { bazs: [1, 2, 3], foo: 'foo', quxs: [1, 2, 3] })
      t.equal(router.query.get('bar')(), 'bar', 'ctx.query.setDefaults works')
      t.deepEqual(router.query.get('bazs')(), [1,2,3], 'ctx.query.get parsing works')
      t.deepEqual(router.query.get('quxs')(), [1,2,3], 'ctx.query.setDefaults parsing works')
    })
    .step((done) => {
      const observableQuery = router.query.getAll(true)
      const killMe = observableQuery.subscribe(() => {
        killMe.dispose()
        t.pass('ctx.query.getAll(true) is subscribable')
        observableQuery({ bar: 'bar', baz: 'baz' })
        done()
      })
      router.query.get('bar')('qux')
    })
    .step(() => {
      const query = router.query.getAll()
      t.deepEqual(query, { foo: 'foo', bar: 'bar', baz: 'baz', bazs: [1,2,3], quxs: [1,2,3] }, 'ctx.query.getAll(true) is writable')
      router.update('/about', {}, false, { foo: 'bar' })
    })
    .step((done) => {
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
    .step((done) => {
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
    .step(() => {
      router.update('/bindings')
    })
    // path binding is applied asynchronously so that links that occur before
    // the router in the dom can use the bindings
    //
    // this is by design and not a hack to get passing tests
    .step((done) => window.requestAnimationFrame(done))
    .step(() => {
      const link = $('#all-bindings-anchor', dom).get(0)
      link.click()
    })
    .step(() => {
      t.equal(router.route().component, 'about', 'path binding navigates (used together)')
      t.deepEqual(router.state(), { foo: 'foo' }, 'state binding sets state (used together)')
      t.deepEqual(router.query.getAll(), { bar: 'bar' }, 'query binding sets query (used together)')
    })
    .step(() => {
      router.update('/bindings', {}, false, { bar: 'bar' })
    })
    .step((done) => window.requestAnimationFrame(done))
    .step(() => {
      const link = $('#state-binding-anchor', dom).get(0)
      link.click()
    })
    .step(() => {
      t.equal(router.route().component, 'bindings', 'state binding persistents path when used alone')
      t.deepEqual(router.state(), { foo: 'foo' }, 'state binding sets state when used alone')
      t.deepEqual(router.query.getAll(), { bar: 'bar' }, 'state binding persists query when used alone')
    })
    .step(() => {
      router.reload()
      router.update('/bindings', { bar: 'bar' }, false, { })
    })
    .step((done) => window.requestAnimationFrame(done))
    .step(() => {
      const link = $('#query-binding-anchor', dom).get(0)
      link.click()
    })
    .step(() => {
      t.equal(router.route().component, 'bindings', 'query binding persistents path when used alone')
      t.deepEqual(router.state(), { bar: 'bar' }, 'query binding persists state when used alone')
      t.deepEqual(router.query.getAll(), { bar: 'bar' }, 'query binding sets query when used alone')
    })
    .step(() => {
      const activeLink = $('#should-be-active', dom)
      t.ok(activeLink.hasClass('active-path'), 'path binding sets `active` class')
    })

    // anchors
    .step(() => {
      router.update('/anchors')
    })
    .step(() => {
      $('body').append($('#about-link', dom))
      const aboutLink = $('#about-link').get(0)

      aboutLink.click()
    })
    .step(() => {
      const aboutLink = $('#about-link').get(0)
      t.equal(ko.contextFor(aboutLink).$router.route().component, 'about', 'clicking a link navigates')
    })
    .step(() => {
      router.update('/anchors')
    })
    .step(() => {
      $('body').append($('#ignored-links', dom))

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
    .step(() => {
      router.update('/persistent/foo')
    })
    .step(() => {
      const persistentRouter = ko.contextFor($('ko-component-router', dom).get(0)).$router
      persistentRouter.state({ foo: 'foo' })
      persistentRouter.query.get('foo')('foo')
      persistentRouter.update('/bar')
    })
    .step(() => {
      const persistentRouter = ko.contextFor($('ko-component-router', dom).get(0)).$router
      t.equals(persistentRouter.state(), undefined)
      t.deepEquals(persistentRouter.query.getAll(), {})
      t.equals(persistentRouter.route().component, 'bar')
      persistentRouter.update('/foo')
    })
    .step(() => {
      const persistentRouter = ko.contextFor($('ko-component-router', dom).get(0)).$router
      t.deepEqual(persistentRouter.state(), { foo: 'foo' }, 'persistState works')
      t.equals(persistentRouter.query.get('foo')(), 'foo', 'persistQuery works')
      t.equals(persistentRouter.route().component, 'foo')
    })

    .step(() => resolve())
  })
}

class RoutingTest {
  constructor(c) {
    this.config = c
    this.routes = {
      // explicit path
      '/about': 'about',

      // one required param (`name`)
      // one optional param (`operation`)
      '/user/:name/:operation?': 'user',

      // route w/ nested router
      '/nested/!': 'nested',

      // various test components
      '/bindings': 'bindings',
      '/anchors': 'anchors',

      // named wildcard segment
      '/file/:file(*)': 'file',

      // persistQuery & persistState options
      '/persistent/!': 'persistent-query-state',

      // wildcard segment
      '/*': '404'
    }
  }
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
    <a id="about-link" href="/about"></a>
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
  `
})
ko.components.register('nested-bar', {
  synchronous: true,
  template: `
    <a id="parent-about" data-bind="path: \'/about\'"></a>
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

test('ko-component-router', (t) => {
  const NUM_TESTS = 44 * 4 + 4
  t.plan(NUM_TESTS)

  t.assert(ko.components.isRegistered('ko-component-router'), 'should register <ko-component-router />')
  t.ok(ko.bindingHandlers.path, 'should register path binding')
  t.ok(ko.bindingHandlers.state, 'should register state binding')
  t.ok(ko.bindingHandlers.query, 'should register query binding')

  runTests(t, { hashbang: false, base: '' })
    .then(() =>
  runTests(t, { hashbang: false, base: '/base' }))
    .then(() =>
  runTests(t, { hashbang: true, base: '' }))
    .then(() =>
  runTests(t, { hashbang: true, base: '/base' }))
})

function step(fn) {
  const p = new Promise((resolve) => {
    ko.tasks.schedule(() => {
      if (fn.length === 1) {
          fn(resolve)
      } else {
        fn()
        resolve()
      }
    })
  })

  return {
    step(nextFn) {
      if (nextFn.length === 1) {
        return step((done) => {
          p.then(() => {
            ko.tasks.schedule(() => {
              nextFn(done)
            })
          })
        })
      } else {
        return step((done) => {
          p.then(() => {
            ko.tasks.schedule(() => {
              nextFn()
              done()
            })
          })
        })
      }
    }
  }
}
