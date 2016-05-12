# ko-component-router

![NPM Version](https://img.shields.io/npm/v/ko-component-router.svg)
![WTFPL](https://img.shields.io/npm/l/ko-component-router.svg)
[![Travis](https://img.shields.io/travis/Profiscience/ko-component-router.svg)](https://travis-ci.org/Profiscience/ko-component-router)
[![Coveralls](https://img.shields.io/coveralls/Profiscience/ko-component-router.svg?maxAge=2592000)]()
[![Dependency Status](https://img.shields.io/david/Profiscience/ko-component-router.svg)](https://david-dm.org/Profiscience/ko-component-router)
[![Peer Dependency Status](https://img.shields.io/david/peer/Profiscience/ko-component-router.svg?maxAge=2592000)]()
[![NPM Downloads](https://img.shields.io/npm/dt/ko-component-router.svg?maxAge=2592000)]()

Component-based router for developing wicked awesome single-page apps with KnockoutJS.

Supports nested routing, read/write querystring param observables, read/write state observables

__[DOCS](https://Profiscience.github.io/ko-component-router/)__

###### app.js ######
```javascript
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
  template: `
    <ko-component-router params="
      routes: routes,
      hashbang: false">
    </ko-component-router>
  `
})

ko.component.register('home', {
  template: `<a href="/users/1234">Show user</a>`
})

ko.components.register('user', {
  viewModel: class User {
    constructor(ctx) {
      // ctx.params
      // ctx.query
      // ctx.hash
      //
      // ...and more!
    },
    template: '<!-- ctx is also available as $router in the binding context -->'
  }
})

ko.applyBindings()
```

###### index.html ######
```html
<body>
  <app></app>
</body>
```

_Requires [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) for IE support_
