# Plugins

A primary goal of this router is to be flexible enough to allow you to structure
your app as you wish. The primary method used to attain this is via plugins.

Plugins are functions that take your route value and return middleware — if applicable —
allowing you to format your routes in any way you see fit.

For example say you wanted to refactor this...

```javascript
import ko from 'knockout'
import Router from 'ko-component-router'
import loadData from './utils/loadData'

ko.components.register('foo', {
  template: '<h1>FOO!</h1>'
})

Router.routes = {
  '/foo': [
    (ctx) => loadData(ctx).then((data) => ctx.data = data),
    (ctx) => document.title = ctx.data.title,
    'foo',
    {
      {
        '/bar': 'bar'
      }
    }
  ]
}
```

...into a much more readable...

```javascript
import Router from 'ko-component-router'
import loadData from './utils/loadData'

Router.routes = {
  '/foo': {
    component: {
      template: '<h1>FOO!</h1>'
    },
    loadData,
    setTitle(ctx) {
      document.title = ctx.data.title
    },
    routes: {
      '/bar': 'bar'
    }
  }
}
```

We could do this by registering a plugin that essentially takes the latter, and
returns the former.

```javascript
import Router from 'ko-component-router'

Router.usePlugin((route) => {
  return [
    (ctx) => route.loadData(ctx).then((data) => ctx.data = data),
    (ctx) => route.setTitle(ctx),
    route.routes,
    (ctx) => ({
      beforeRender() {
        ko.components.register(ctx.pathname, route.component)
        ctx.route.component = ctx.pathname
      },
      afterDispose() { ko.components.unregister(ctx.pathname) }
    })
  ]
})
```

Better yet, plugins can be composed as such...

```javascript
import Router from 'ko-component-router'

function componentPlugin(route) {
  return (ctx) => ({
    beforeRender() {
      ko.components.register(ctx.pathname, route.component)
      ctx.route.component = ctx.pathname
    },
    afterDispose() {
      ko.components.unregister(ctx.pathname)
    }
  })
}

function titlePlugin(route) {
  return (ctx) => route.setTitle(ctx)
}

function nestedRoutePlugin(route) {
  return route.routes
}

function loadDataPlugin(route) {
  return (ctx) => route.loadData(ctx).then((data) => ctx.data = data)
}

Router.plugins = [
  componentPlugin,
  titlePlugin,
  nestedRoutePlugin,
  loadDataPlugin
]
```

As you've seen, plugins are registered by using `Routes.usePlugin(fn)`.

Plugins must be registered *before* routes.

Plugins may return anything the router can make sense of, i.e. a middleware function,
a component name, or a nested route object. They can also return an array of any combination
of the preceding, as shown in the example without composition. If a plugin doesn't
return anything, or returns false, it will be treated as an empty array.

If the array accumulated by running all plugins against a given route is empty, it
is assumed the route is in a format the router understands, and it will be parsed.
Otherwise — so if a plugin was "successful" at interpreting the route and returned something —
the route will not be passed along.

Routes with array configs will have the plugins ran against each config in that array, not the whole array.

---

[Back](./)
