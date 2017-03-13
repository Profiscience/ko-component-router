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
  template: '<ko-component-router></ko-component-router>',
  viewModel: App
})

ko.components.register('user', {
  template: '<ko-component-router></ko-component-router>',
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
  template: '<ko-component-router></ko-component-router>',
  viewModel: App
})

ko.components.register('user-list', ...)
ko.components.register('user-create', ...)
ko.components.register('user-show', ...)
ko.components.register('user-edit', ...)
```

> That's great and all, but an empty router isn't enough for me. I want define
> a custom component for the parent, and still use the nested route syntax.
— you, right now.

Well, you can do that, simply pass the component name as you would and include
an empty router component in the template. Here's the above, with a common header
for all user pages.

```javascript
class App {
  constructor() {
    this.routes = {
      '/user': [
        'user-header',
        {
          '/': 'user-list',
          '/new': 'user-create',
          '/:id': 'user-show',
          '/:id/edit': 'user-edit'
        }
      ]
    }
  }
}

ko.components.register('app', {
  template: '<ko-component-router></ko-component-router>',
  viewModel: App
})

ko.components.register('user-header', {
  template: `
    <a data-bind="path: '/'">
      List
    </a>
    <a data-bind="path: '/new'">
      New User
    </a>

    <ko-component-router></ko-component-router>
  `
})

ko.components.register('user-list', ...)
ko.components.register('user-create', ...)
ko.components.register('user-show', ...)
ko.components.register('user-edit', ...)
```

**One more thing!**

Using the deep route object has the benefit of letting the router know all
available routes synchronously, so it enables ambiguous routes to be used.
This is yet another case where [code](../test/routing/ambiguous.js) can
explain things much easier than I can.

:hamburger: :fries: Have it your way.

---

[Back](./)
