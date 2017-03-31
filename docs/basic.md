# Installation
```bash
$ npm install ko-component-router
```

The following browser features are required:

| Feature       | Browser Support     | Polyfill                              |
| ------------- | ------------------- | ------------------------------------- |
| Promises/A+   | [Link][promise]     | [es6-promise][promise-polyfill]       |
| History       | [Link][history]     | [html5-history-api][history-polyfill] |

If using the above HTML5 history polyfill, be sure to configure the polyfill after loading;
the polyfill must have the `!` path prefix registered via:

```javascript
window.history.setup('/', '!/', null)
```

## Configuration

Configuration is set using the static `.setConfig` method on the Router

```javascript
import Router from 'ko-component-router'

Router.setConfig({
  // base path app runs under, i.e. '/app'
  base: '',

  // hashbang vs HTML5 (pushState) routing
  hashbang: false,

  // CSS class added to elements with a path binding that resolves to the current
  // page — useful for styling navbars and tabs
  activePathCSSClass: 'active-path'
})
```

## Registering Routes

Routes are registered using the static `.useRoutes` method on the Router.

Routes are objects with [express style routes](https://github.com/pillarjs/path-to-regexp)
as keys, and a(n)
  a) component name for the view
  b) [middleware](./middleware.md) function
  c) [nested route](./nested-routing.md) config
  d) array of the above

This is merely the default syntax, and you are encouraged to use [plugins](./plugins.md)
to set up an architecture that makes sense for your app. For more on this, see the
[best practices](./best-practices.md).

Component viewModels and middleware functions will receive a [context](./context.md)
object that contains information such as the route params, current path information,
and any data attached via middleware as their first argument.

If a picture is worth 1k words, code is worth 1M...

```javascript
import Router from 'ko-component-router'

Router.useRoutes({
  routes: {
    '/': 'home',

    '/users': {
      '/': [loadUsers, 'user-list'],

      '/:id': [loadUser, {
        '/': 'user-show',
        '/edit': 'user-edit'
      }]
    }
  }
})

ko.components.register('home', {
  template: '<a data-bind="path: \'/users\'">'
})

ko.components.register('user-list', {
  viewModel: class UserList {
    constructor(ctx) {
      this.users = ctx.users
    }
  },
  template: `
    <ul data-bind="foreach: users">
      <li><a data-bind="text: user.name, path: '/' + user.id"></a><li>
    </ul>
  `
})

ko.components.register('user', {
  viewModel: class User {
    constructor(ctx) {
      console.log(ctx.params.userID)
      // 1234
    }
  },
  template: '...'
})

ko.applyBindings()
```

```html
<!doctype html>
<script src="/app.js"></script>
<ko-component-router></ko-component-router>
```

__NOTE:__
When using without a module system, `const Router = ko.router.default`
When using with commonjs, `const { default: Router } = require('ko-component-router')`

---

[Back](./README.md)

[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Browser_compatibility  "MDN - Promise"
[promise-polyfill]: https://github.com/stefanpenner/es6-promise "es6-promise"
[history]: https://developer.mozilla.org/en-US/docs/Web/API/History_API#Browser_compatibility "MDN - History API"
[history-polyfill]: https://github.com/devote/HTML5-History-API "HTML5-History-API"
