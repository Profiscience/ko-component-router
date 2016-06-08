import $ from 'jquery'
import ko from 'knockout'

ko.components.register('context', {
  synchronous: true,
  viewModel: class Context {
    constructor(ctx) {
      this.sub = ctx.hash.subscribe((h) => {
        $(`#${h}`).velocity('scroll')
      })
    }
    dispose() {
      this.sub.dispose()
    }
  },
  template: `
    <div class="component-container">
      <section>
        <h2 id="params">
          params
          <small class="text-muted">read-only</small>
        </h2>
        <p>
          route params are directly accessible as read-only observables via
          <code>ctx.params</code>
        </p>

<pre><code data-bind="prism: 'javascript'">
// route: '/user/:id/:operation?'

class ViewModel {
  constructor(ctx) {
    // @ '/user/1234'
    ctx.params.id() // 1234
    ctx.params.operation() // null

    // @ '/user/1234/edit'
    ctx.params.id() // 1234
    ctx.params.operation() // 'edit'
  }
}
</code></pre>

      </section>

      <section>
        <h2 id="query">
          query
          <small class="text-muted">read/write</small>
        </h2>
        <p>
          read/write query parameter observables are accessible via
          <code>ctx.query.get(parameterName, [defaultValue], [parser])</code>
        </p>
        <p>
          Default values and an optional parsing function may be supplied via
          <code>ctx.query.get(parameterName, defaultValue, parser)</code> or
          <code>ctx.query.setDefaults({ parameterName: defaultValue }, parser)</code>.

          Default values a) will cause query params to be ommitted from the query string
          if they are equal to the default and b) will initialize the value if it
          is ot present in the query string. The parsing function can be especially
          handy when you want to use an array of integers, an they will normally be
          parsed as strings.
        </p>
        <p>
          query params are scoped to the local router, so you may use the same
          name for params across different components, or nest the same component
          within itself, and maintain separate states.
        </p>
        <p>
          query params that don't exist in the querystring will be initialized
          to their default values (if defined), and params that match their default
          values will not pollute the querystring.
        </p>
        <p>
          <em>See the page on <a data-bind="path: '/nested-routing/foo'">nested routing</a> for an example</em>
        </p>

<pre><code data-bind="prism: 'javascript'">
class ViewModel {
  constructor(ctx) {
    // read/write observable for 'foobar' querystring parameter with
    // a default value of 'foo'
    this.foobar = ctx.query.get('foobar', 'foo')

    // set 'foobar' to 'bar'
    this.foobar('bar')

    this.foobar()
    // 'bar'

    // sets default values
    ctx.query.setDefaults({
      baz: 'quz'
    }, [parser])

    ctx.query.getAll(asObservable)
    // {
    //   foobar: 'bar',
    //   baz: 'quz'
    // }

    // reset all params to their default values; triggers only
    // one update
    ctx.query.clear()

    // update multiple query params; triggers only one update
    ctx.query.update({
      foo: randomString(),
      bar: randomString()
    })
  }
}
</code></pre>

      </section>

      <section>
        <h2 id="state">
          state
          <small class="text-muted">read/write</small>
        </h2>
        <p>
          read/write observable history.state abstraction accessible directly via
          <code>ctx.state()</code>
        </p>
        <p>
          scoped to local router, similarly to query params
        </p>
        <p>
          <em>See the page on <a data-bind="path: '/nested-routing/foo'">nested routing</a> for an example</em>
        </p>
      </section>

      <section>
        <h2 id="route">
          route
          <small class="text-muted">read-only</small>
        </h2>
        <p>
          read-only observable containing route
        </p>
      </section>

      <section>
        <h2 id="path">
          path
          <small class="text-muted">read-only</small>
        </h2>
        <p>
          read-only observable containing path with respect to local router
        </p>
      </section>

      <section>
        <h2 id="pathname">
          pathname
          <small class="text-muted">read-only</small>
        </h2>
        <p>
          read-only observable containing pathname (path w/o querystring) with respect to local router
        </p>
      </section>

      <section>
        <h2 id="canonicalPath">
          canonicalPath
          <small class="text-muted">read-only</small>
        </h2>
        <p>
          read-only observable containing full path
        </p>
      </section>

      <section>
        <h2 id="hash">
          hash
          <small class="text-muted">read-only</small>
        </h2>
        <p>
          read-only observable containing anchor
        </p>
      </section>

      <section>
        <h2 id="isNavigating">
          isNavigating
          <small class="text-muted">read-only</small>
        </h2>
      </section>

      <section>
        <h2 id="update">
          update
          <small class="text-muted">(url, state = {}, push = true, query = false) => Promise(didUpdate)</small>
        </h2>
        <p>
          updates the context and trigger one update; bubbles up to parent router(s)
          if matching route is not found
        </p>
        <p>
          if <code>push === true</code>, use <code>pushState</code>, else <code>replaceState</code>
        </p>
        <p>
          if <code>query</code> is false (or unsupplied), get from parsed querystring from <code>url</code>
          <br>
          if <code>query</code> is an object, set this context's query to the contents
        </p>
        <p>
          returns <code>false</code> if route is not matched, otherwise a promise that resolves
          <code>true</code> if update occurred and <code>false</code> otherwise (if blocked by
          an <code>addBeforeNavigateCallback</code> callback)
        </p>
        <div class="alert alert-info">
         The top level router's <code>update</code> function is available at <code>ko.router.update()</code>
        <div>
      </section>

      <section>
        <h2 id="addBeforeNavigateCallback">
          addBeforeNavigateCallback
          <small class="text-muted">(cb) => cb([done])</small>
        </h2>
        <p>
          adds function to be called before navigating away from the current page. to perform async
          actions before unmounting, you may use the optional done callback or return a promise.
          additionally, returning <code>false</code>, a promise that resolves to <code>false</code>, or
          supplying a value of <code>false</code> as the first argument to the optional done callback,
          navigation will be prevented.
        </p>
        <p>
          use this function to confirm navigation away, show unsaved change warnings, perform async cleanup,
          etc.
        </p>
      </section>

      <section>
        <h2 id="parent">
          $parent
        </h2>
        <p>
          parent router ctx accessor
        </p>
      </section>

      <section>
        <h2 id="child">
          $child
        </h2>
        <p>
          child router ctx accessor
        </p>
      </section>

      <a data-bind="path: '/config'" class="btn btn-primary"><i class="fa fa-arrow-left"></i> config</a>
      <span class="pull-right">
        <a data-bind="path: '/bindings'" class="btn btn-primary">bindings <i class="fa fa-arrow-right"></i></a>
      </span>
    </div>
` })
