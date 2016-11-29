# Nested

Nested routing is supported ootb, and should be painless. Everything works
identically, except the base path is inferred. To define a route that contains
child routes, end it with a `!`.

```javascript
class App {
  constructor() {
    this.routes = {
      // note the `!`
      '/user/!': 'user'
    }
  }
}

class User {
  constructor() {
    this.routes = {
      '/': 'user-list',
      '/new': 'user-create',
      '/:id': 'user-show',
      '/:id/edit': 'user-edit'
    }
  }
}

ko.components.register('app', {
  template: '<ko-component-router params="routes: routes"></ko-component-router>',
  viewModel: App
})

ko.components.register('user', {
  template: '<ko-component-router params="routes: routes"></ko-component-router>',
  viewModel: User
})

ko.components.register('user-list', ...)
ko.components.register('user-create', ...)
ko.components.register('user-show', ...)
ko.components.register('user-edit', ...)
```
