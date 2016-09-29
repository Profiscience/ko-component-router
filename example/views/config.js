import $ from 'jquery'
import ko from 'knockout'
import escape from 'escape-html'

ko.components.register('config', {
  synchronous: true,
  viewModel: class Config {
    constructor(ctx) {
      const sub = ctx.hash.subscribe((h) => $(`#${h}`).velocity('scroll'))
      ctx.addBeforeNavigateCallback(() => sub.dispose())
    }
  },
  template: `
    <div class="component-container">
      <section>
<pre><code data-bind="prism: 'html'">${escape(`<ko-component-router params="
  routes = {},
  base = '',
  hashbang = false,
  inTransition = noop,
  outTransition = noop
">
</ko-component-router>`)}
</code></pre>
      </section>

      <section>
        <h2 id="routes">
          routes
        </h2>
        <p>
          <code>routes</code> is an object where the keys are <a href="https://github.com/pillarjs/path-to-regexp">express style</a>
          routes and values are the array <code>[...callbacks, 'component-name']</code> or just <code>component-name</code> for shorthand
        </p>
        <p>
          <code>...callbacks</code> are functions that are called with the router context and an optional <code>done</code> callback and
          will be called sequentially before setting the router's view to <code>'component-name'</code>
        </p>
        <p>
          if callbacks aren't your style, you can also use promises
        </p>

<pre><code data-bind="prism: 'javascript'">
const routes = {
  // explicit path
  '/about': 'about',

  // one required param (\`name\`)
  // one optional param (\`operation\`)
  '/user/:name/:operation?': [
    getUser,
    'user'
  ],

  // wildcard segment
  '/*': '404',

  // named wildcard segment
  '/file/:file(*)': 'file'
}

function getUser(ctx /*, done */) {
  return new Promise((resolve) => {
    $.get(\`/API/Users/\${ctx.params.name}\`).then((u) => {
      ctx.state.user = u
      resolve()
    })
  })
}
</code></pre>

<br/>

<p>
  the callbacks can also be used for dynamic routing by setting <code>ctx.route.component</code>
</p>

<br/>

<pre><code data-bind="prism: 'javascript'">
const routes = {
  '/user/:name/:operation?': [getComponent]
}

function getComponent(ctx) {
  if (ctx.params.operation === 'edit') {
    ctx.route.component = 'user-edit'
  } else {
    ctx.route.component = 'user-show'
  }
}
</code></pre>
      </section>

      <section>
        <h2 id="base">
          base
        </h2>
        <p>
          the base path your app is running under, if applicable.
          e.g., your app is running from a \`/blog\` directory
        </p>
        <p>
          this option is only applicable to the top-level router
        </p>
      </section>

      <section>
        <h2 id="hashbang">
          hashbang
        </h2>
        <p>
          whether or not to use HTML4 hashbang routing. defaults to <code>false</code>.
        </p>
        <p>
          this option is only applicable to the top-level router
        </p>
        <p>
          when using with legacy browsers that do not support the <code>history</code>
          API, you should include the <a href="https://github.com/devote/HTML5-History-API">HTML5-History-API polyfill</a>
          as follows:
        </p>

<pre><code data-bind="prism: 'html'">
${escape(`<!--[if lte IE 9]><script src="https://cdnjs.cloudflare.com/ajax/libs/html5-history-api/4.0.2/history.iegte8.min.js?type=!/&basepath=<basepath>"></script><![endif]-->`)}
</code></pre>
      </section>

      <section>
        <h2 id="persistQuery">
          persistQuery
        </h2>
        <p>
          whether or not to preserve the querystring when navigating between pages. defaults to <code>false</code>.
        </p>
        <p>
          note, when the router is unmounted the queries will be disposed
        </p>
      </section>

      <section>
        <h2 id="persistState">
          persistState
        </h2>
        <p>
          whether or not to preserve the querystring when navigating between pages. defaults to <code>false</code>.
        </p>
        <p>
          note, when the router is unmounted the states will be disposed
        </p>
      </section>

      <section>
        <h2 id="queryStringifier">
          queryStringifier
          <small class="text-muted">(query) => urlEncodedQuery</small>
        </h2>
        <p>
          function that recieves a JS object as the first parameter and returns
          a url-safe encoded querystring. Defaults to <a href="https://www.npmjs.com/package/qs">qs.parse</a>.
        </p>
        <p>
          note, this option can only be defined at the top-level router
        </p>
        <p>
          may be used to implement an alternative query encoding, such as
          <a href="https://github.com/Sage/jsurl">jsurl</a> or <a href="https://github.com/scrollback/juri">juri</a>.
        </p>
        <p>
          <em>
            this demo uses juri, check the source and see it in action on the
            <a data-bind="path: '/nested-routing/foo'">nested routing</a> page.
          </em>
        </p>
      </section>

      <section>
        <h2 id="queryParser">
          queryParser
          <small class="text-muted">(urlEncodedQuery) => query</small>
        </h2>
        <p>
          inverse of queryStringifier
        </p>
      </section>

      <section>
        <h2 id="inTransition">
          inTransition
          <small class="text-muted">(el, fromCtx, toCtx) => {}</small>
        </h2>
        <p>
          defines a function to run immediately after mounting a component
        </p>
        <p>
          useful for animating when the component you are transitioning
          from influences the entry animation
        </p>
      </section>

      <section>
        <h2 id="outTransition">
          outTransition
          <small class="text-muted">(el, fromCtx, toCtx, [done]) => {}</small>
        </h2>
        <p>
          defines a function to run immediately before unmounting a component
        </p>
        <p>
          useful for animating when the component you are transitioning
          to influences the exit animation
        </p>
        <p>
          if <code>done</code> is passed in, the router will wait for it to be called
          before finishing the unmount
        </p>
      </section>

      <a data-bind="path: '/'" class="btn btn-primary"><i class="fa fa-arrow-left"></i> getting started</a>
      <span class="pull-right">
        <a data-bind="path: '/context'" class="btn btn-primary">context <i class="fa fa-arrow-right"></i></a>
      </span>
    </div>
` })
