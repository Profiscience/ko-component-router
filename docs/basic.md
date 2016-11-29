# Installation
```bash
$ npm install ko-component-router
```

# Basic Usage

If a picture is worth 1k words, code is worth 1M...

```javascript
import ko from 'knockout'

// import router
import 'ko-component-router'

// define app component that contains our router
ko.components.register('app', {
  viewModel: class App {
    constructor() {
      this.routes = {
        // express-style-route: component-name        
        // see https://github.com/pillarjs/path-to-regexp for all possibilities
        '/': 'home',
        '/user/:userID': 'user'
      }
    }
  },
  template: '<ko-component-router params="routes: routes"></ko-component-router>'
})

// define component
ko.components.register('home', {
  template: `<a href="/user/1234">Show user</a>`
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
<app></app>
```

Assuming we landed on `/`, the `home` component would be displayed. If we then clicked
the "Show User" link, the `user` component would be displayed, and the user id logged
to the console.

---

The router accepts 2 parameters:

| option | description | example |
| ------ | ----------- | ------- |
| routes | object containing express-style routes as keys, and their corresponding view component names or an array containing [middleware](./middleware.md) | `{ '/home': 'home' }` |
| base   | optional parameter defining the base path, this should only be used with the top-level router if using child routing | `/blog` |

---

Any other parameters will be attached to the context and made available in middleware and routed components

```html
<ko-component-router params="routes: routes, foo: 'foo'">
```

```javascript
class ViewModel {
  constructor(ctx) {
    // ctx.foo === 'foo'
  }
}
```

---

[Back](./README.md)
