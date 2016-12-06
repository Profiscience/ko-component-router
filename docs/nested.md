# Nested

Nested routing is supported ootb, and should be painless. Everything works
identically, except the base path is inferred.

There are two ways to define child routes, and which you use depends on the
way you choose to structure your app, and just how much control you desire at each
route. You can also use both in the same app as you feel necessary.

## Method 1 (nested `<ko-component-router>` component)
In this method, you have a route which resolves to a component which contains
another router component. In the top level, suffix your route with `!`, and
you're good to go.

e.g.

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

## Method 2 (deep route object)
Alternatively, you may define all of your routes in one place (or not, if using a module system) as such...

```javascript
class App {
  constructor() {
    this.routes = {
      // note the `!`
      '/user': {
        '/': 'user-list',
        '/new': 'user-create',
        '/:id': 'user-show',
        '/:id/edit': 'user-edit'
      }
    }
  }
}

ko.components.register('app', {
  template: '<ko-component-router params="routes: routes"></ko-component-router>',
  viewModel: App
})

ko.components.register('user-list', ...)
ko.components.register('user-create', ...)
ko.components.register('user-show', ...)
ko.components.register('user-edit', ...)
```
