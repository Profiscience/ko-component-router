import ko from 'knockout'
import escape from 'escape-html'
import lipsum from '../lib/lipsum'

ko.components.register('nested-routing', {
  synchronous: true,
  template: `
    <div class="component-container">
      <section>
        <h2>nested routing</h2>

        <p>
          For the most part, you don't have to think about nested routing,
          it just works.
        </p>
        <p>
          The only caveat is that the parent component's route must be suffixed
          with a <code>!</code>.
        </p>
        <p>
          <code>ctx</code> will have <code>query</code> and <code>state</code>
          objects just as you would expect, and they are scoped to the local router.
          To better understand this, check out the demo below.

          Reading the source for this page is also highly recommended.
        </p>
      </section>
      <section>
<pre><code data-bind="prism: 'javascript'">
ko.components.register('foo-router', {
  viewModel: class FooRouter {
    constructor(ctx) {
      this.qsParam = ctx.query.get('foo', 'foo')

      this.state = ko.pureComputed({
        read() {
          return JSON.stringify(ctx.state())
        },
        write(v) {
          ctx.state(JSON.parse(v))
        }
      })

      this.routes = {
        '/foo': 'foo',
        '/bar': 'bar',
        '/baz': 'baz',
        '/qux': 'qux',
        // note the suffixed \`!\` denoting a child path may exist
        '/fooception/!': 'foo-router'
      }
    }

    randomString() {
      return lipsum[Math.floor(Math.random() * 100)]
    }

    randomObj() {
      const obj = {}
      for (let i = 0; i < 5; i++) {
        obj[lipsum[Math.floor(Math.random() * 100)]] = lipsum[Math.floor(Math.random() * 100)]
      }
      return obj
    }
  },
  template: \`${escape(`
    <label>Querystring Parameter (<code>foo</code> scoped to local router)</label>
    <input type="text" placeholder="foo" data-bind="value: qsParam">

    <label>State (also scoped to local router)</label>
    <small>requires valid JSON</small>
    <input type="text" data-bind="value: state" placeholder='{ "foo": "foo" }'>

    <a data-bind="path: '/foo'">foo</a>
    <a data-bind="path: '/bar'">bar</a>
    <a data-bind="path: '/baz'">baz</a>
    <a data-bind="path: '/qux'">qux</a>
    <a data-bind="path: '/fooception', state: randomObj(), query: { foo: randomString() }">foo-ception</a>

    <ko-component-router params="routes: routes">
    </ko-component-router>
  `)}\`
})

ko.components.register('foo', {
  template: 'foo!'
})

// ...
</code></pre>
      </section>

      <div class="alert alert-info">
        <em>
          edit these value and refresh the page or use browser navigation to see how state is preserved
        </em>
      </div>

      <foo-router params="query: $router.query, state: $router.state"></foo-router>

      <a data-bind="path: '/bindings'" class="btn btn-primary"><i class="fa fa-arrow-left"></i> bindings</a>
    </div>
  `
})

ko.components.register('foo-router', {
  synchronous: true,
  viewModel: class FooRouter {
    constructor(ctx) {
      this.qsParam = ctx.query.get('foo', 'foo')

      this.state = ko.pureComputed({
        read() {
          return JSON.stringify(ctx.state())
        },
        write(v) {
          ctx.state(JSON.parse(v))
        }
      })

      this.routes = {
        '/foo': 'foo',
        '/bar': 'bar',
        '/baz': 'baz',
        '/qux': 'qux',
        '/fooception/!': 'foo-router'
      }
    }

    randomString() {
      return lipsum[Math.floor(Math.random() * 100)]
    }

    randomObj() {
      const obj = {}
      for (let i = 0; i < 5; i++) {
        obj[lipsum[Math.floor(Math.random() * 100)]] = lipsum[Math.floor(Math.random() * 100)]
      }
      return obj
    }
  },
  template: `
    <div class="panel panel-primary">
      <div class="panel-heading">
        foo router
      </div>
      <div class="panel-body">
        <div class="row">
          <div class="col-sm-6">
            <form class="form-inline">
              <div class="form-group">
                <label>Querystring Parameter (<code>foo</code> scoped to local router)</label>
                <input type="text" class="form-control" style="width: 100%" placeholder="foo" data-bind="value: qsParam">
              </div>
            </form>
          </div>
          <div class="col-sm-6">
            <form class="form-inline">
              <div class="form-group">
                <label>State (also scoped to local router)</label>
                <small class="text-muted">requires valid JSON</small>
                <input type="text" class="form-control" style="width: 100%" data-bind="value: state" placeholder='{ "foo": "foo" }'>
              </div>
            </form>
          </div>
        </div>
        <hr>
        <a data-bind="path: '/foo'" class="btn btn-success">foo</a>
        <a data-bind="path: '/bar'" class="btn btn-danger">bar</a>
        <a data-bind="path: '/baz'" class="btn btn-info">baz</a>
        <a data-bind="path: '/qux'" class="btn btn-warning">qux</a>
        <a data-bind="path: './fooception/foo', query: { foo: randomString() }, state: randomObj()" class="btn btn-primary">foo-ception</a>
        <br><br>
        <ko-component-router params="routes: routes">
        </ko-component-router>
      </div>
    </div>
  `
})

ko.components.register('foo', {
  synchronous: true,
  template: `
    <div class="alert alert-success">
      foo!
    </div>
  `
})

ko.components.register('bar', {
  synchronous: true,
  template: `
    <div class="alert alert-danger">
      bar!
    </div>
  `
})

ko.components.register('baz', {
  synchronous: true,
  template: `
    <div class="alert alert-info">
      baz!
    </div>
  `
})

ko.components.register('qux', {
  synchronous: true,
  template: `
    <div class="alert alert-warning">
      qux!
    </div>
  `
})
