import ko from 'knockout'
import escape from 'escape-html'

ko.components.register('getting-started', {
  synchronous: true,
  template: `
    <div class="component-container">
      <section>
        <h2>overview</h2>

        <p>
          <code>ko-component-router</code> is a client-side router that allows you
          to easily build single page apps with KnockoutJS. It supports all the things
          you would expect a road-worthy spa router to support, with just enough
          Knockout magic thrown in.
        </p>

        <p>
          It aims to be as performant as possible by batching
          updates, and it provides simple abstractions for working with querystring parameters
          and history.state is a self-contained manner.
        <p>
      </section>
      <section>
        <h2>installation</h2>

<pre><code data-bind="prism: 'bash'">
$ npm install ko-component-router
</code></pre>
      </section>

      <section>
        <h2>(most) basic usage</h2>

<h4 class="text-muted">app.js</h4>
<pre><code data-bind="prism: 'javascript'">
'use strict'

require('ko-component-router')

ko.components.register('app', {
  viewModel: class App {
    constructor() {
      this.routes = {
        '/': 'home',
        '/user/:id': 'user'
      }
    }
  },
  template: \`${escape(`
    <ko-component-router params="
      routes: routes,
      base: '',
      hashbang: false">
    </ko-component-router>
  `)}\`
})

ko.components.register('home', {
  template: \`${escape(`<a href="/user/1234">Show user</a>`)}\`
})

ko.components.register('user', {
  viewModel: class User {
    constructor(ctx) {
      // ctx contains a bunch of information about the
      // current state of the router

      // many are read/write observables,
      // see each section for more info
    }
  },
  template: '${escape(`User: <!-- ko text: $router.params.id  --><!-- /ko -->`)}'
})

ko.applyBindings()
</code></pre>

<h4 class="text-muted">index.html</h4>
<pre><code data-bind="prism: 'html', noEscape: true">
${escape(`<!doctype html>
<script src="/app.js"></script>
<app></app>`)}
</pre></code>
    </section>

    <span class="pull-right">
      &nbsp;&nbsp;&nbsp;
      <a data-bind="path: '/config'" class="btn btn-primary">config <i class="fa fa-arrow-right"></i></a>
    </span>
    <span class="clearfix"></span>
    </div>
  `
})
