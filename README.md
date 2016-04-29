# ko-component-router

![NPM](https://img.shields.io/npm/v/ko-component-router.svg)
![WTFPL](https://img.shields.io/npm/l/ko-component-router.svg)
[![Travis](https://img.shields.io/travis/Profiscience/ko-component-router.svg)](https://travis-ci.org/Profiscience/ko-component-router)
[![CodeClimate](https://img.shields.io/codeclimate/github/Profiscience/ko-component-router.svg)](https://codeclimate.com/github/Profiscience/ko-component-router)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/github/Profiscience/ko-component-router.svg)](https://codeclimate.com/github/Profiscience/ko-component-router/coverage)
[![Dependency Status](https://img.shields.io/david/Profiscience/ko-component-router.svg)](https://david-dm.org/Profiscience/ko-component-router)
[![Join the chat at https://gitter.im/Profiscience/ko-component-router](https://badges.gitter.im/Profiscience/ko-component-router.svg)](https://gitter.im/Profiscience/ko-component-router?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

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
