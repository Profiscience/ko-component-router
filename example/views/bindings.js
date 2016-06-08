import $ from 'jquery'
import ko from 'knockout'
import escape from 'escape-html'

ko.components.register('bindings', {
  synchronous: true,
  viewModel: class Bindings {
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
        <h2>
          path
        </h2>
        <p>
<pre><code data-bind="prism: 'html'">${escape(`<div data-bind="path: '/user'"></div>`)}</code></pre>
        <span class="label label-info">note</span>
        this uses <code>ctx.update</code> behind the scenes, so it bubbles up in
        the same manner — i.e. you can bind to any url that the current or any
        parent router knows how to handle
        </p>
        <p>
        if you need to force a bubble up to the parent router, you can add <code>..</code>
        for each level you want to go up. e.g. <code>data-bind="path: '../user/1234'"</code>
        </p>
        <p>
        if you need to force the router to evaluate the route without bubbling,
        you can prepend <code>./</code>
        </p>
        <p>
        if you'd like to force the route to be evaluated top-down, prefix your route with <code>//</code>
        </p>
        <div class="alert alert-info">
          the path binding also binds the class <code>active-path</code> when applicable.
          you can use this to easily style active links, such as those in navs
        </div>
      </section>
      <section>
        <h2>
          state
        </h2>
        <p>
<pre><code data-bind="prism: 'html'">${escape(`<div data-bind="state: { todos: todos }"></div>`)}</code></pre>
        </p>
      </section>
      <section>
        <h2>
          query
        </h2>
        <p>
<pre><code data-bind="prism: 'html'">${escape(`<div data-bind="query: { searchText: 'foobar' }"></div>`)}</code></pre>
        </p>
      </section>
      <section>
        <p>
          you may use one — or any combination of — these bindings on an element
          to create a click handler that will update the path, state, and/or query
        </p>
        <p>
          these can be handy to avoid base-path + hashbang hell, and to pass in an initial
          state when navigating via click
        </p>
        <p>
          they can also be used to prepopulate the data for a page, e.g.
        </p>
<pre><code data-bind="prism: 'html'">${escape(`
<ul data-bind="foreach: { data: users, as: 'user' }">
  <li data-bind="text: user.name, path: '/user/' + user.id, state: user"></li>
</ul>`)}
</code></pre>
        <p>
          in this case, the \`state\` and \`path\` bindings are being used together
          to create a link from an index page listing users, to an individual users
          page, and passes in the user on the state object. this could prevent the
          need for ajax altogether on some pages, or reduce the amount of additional
          data required, allowing you to render more of the page, sooner.
        </p>
      </section>

      <section>
        <a data-bind="path: '/context'" class="btn btn-primary"><i class="fa fa-arrow-left"></i> context</a>
        <span class="pull-right">
          <a data-bind="path: '/nested-routing/foo'" class="btn btn-primary">nested routing <i class="fa fa-arrow-right"></i></a>
        </span>
      </section>
    </div>
` })
