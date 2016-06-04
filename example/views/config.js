import $ from 'jquery'
import ko from 'knockout'
import escape from 'escape-html'

ko.components.register('config', {
  synchronous: true,
  viewModel: class Config {
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
          routes should be passed into the router as an object where
          key === express-style route and value === component
        </p>

<pre><code data-bind="prism: 'javascript'">
const routes = {
  // explicit path
  '/about': 'about',

  // one required param (\`name\`)
  // one optional param (\`operation\`)
  '/user/:name/:operation?': 'user',

  // wildcard segment
  '/*': '404',

  // named wildcard segment
  '/file/:file(*)': 'file'
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
