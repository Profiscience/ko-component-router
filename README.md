# ko-component-router

[![NPM Version](https://img.shields.io/npm/v/ko-component-router.svg)](https://www.npmjs.com/package/ko-component-router)
![WTFPL](https://img.shields.io/npm/l/ko-component-router.svg)
[![Travis](https://img.shields.io/travis/Profiscience/ko-component-router/master.svg)](https://travis-ci.org/Profiscience/ko-component-router/)
[![Coverage Status](https://coveralls.io/repos/github/Profiscience/ko-component-router/badge.svg)](https://coveralls.io/github/Profiscience/ko-component-router)
[![Dependency Status](https://img.shields.io/david/Profiscience/ko-component-router.svg)](https://david-dm.org/Profiscience/ko-component-router)
[![Peer Dependency Status](https://img.shields.io/david/peer/Profiscience/ko-component-router.svg?maxAge=2592000)](https://david-dm.org/Profiscience/ko-component-router#info=peerDependencies&view=table)
[![Greenkeeper badge](https://badges.greenkeeper.io/Profiscience/ko-component-router.svg)](https://greenkeeper.io/)
[![NPM Downloads](https://img.shields.io/npm/dt/ko-component-router.svg?maxAge=2592000)](http://npm-stat.com/charts.html?package=ko-component-router&author=&from=&to=)
[![Gitter](https://img.shields.io/gitter/room/profiscience/ko-component-router.svg)](https://gitter.im/Profiscience/ko-component-router)

Super-duper flexible component based router + middleware framework for developing wicked awesome single page apps with [KnockoutJS](https://knockoutjs.com)

### Installation
```bash
$ npm install ko-component-router
```
...or...
```bash
$ yarn add ko-component-router
```

### Usage
_app.js_
```typescript
import * as $ from 'jquery'
import * as ko from 'knockout'
import { Router } from 'ko-component-router'

const loading = ko.observable(true)

Router.use(loadingMiddleware)

Router.useRoutes({
  '/': 'home',
  '/users': {
    '/': [loadUsers, 'users'],
    '/:id': [loadUser, 'user']
  }
})

ko.component.register('home', {
  template: `<a data-bind="path: '/users'">Show users</a>`
})

ko.components.register('users', {
  viewModel: class UsersViewModel {
    constructor(ctx) {
      this.users = ctx.users
    }

    navigateToUser(user) {
      Router.update('/users/' + user.id, { with: { user } })
    }
  },
  template: `
    <ul data-bind="foreach: users">
      <span data-bind="text: name, click: navigateToUser"></span>
    </ul>
  `
})

ko.components.register('user', {
  viewModel: class UserViewModel {
    constructor(ctx) {
      this.user = ctx.user
    }
  },
  template: `...`
})

function loadingMiddleware(ctx) {
  return {
    beforeRender() {
      loading(true)
    },
    afterRender() {
      loading(false)
    }
  }
}

// generators are also supported if you're a pioneer of sorts
// function * loadingMiddleware(ctx) {
//   loading(true)
//   yield
//   loading(false)
// }

// TypeScript? Good for you! Just add ~water~ these lines
// declare module 'ko-component-router' {
//   interface IContext {
//     user?: MyUserTypeDef
//     users?: MyUserTypeDef[]
//   }
// }

function loadUsers(ctx) {
  // return promise for async middleware
  return $.get('/api/users/').then((us) => ctx.users = us)
}

function loadUser(ctx) {
  // if not passed in via `with` from Users.navigateToUser
  if (!ctx.user) {
    return $.get('/api/users/' + ctx.params.id).then((u) => ctx.user = u)
  }
}

ko.applyBindings({ loading })
```
_index.html_
```html
<ko-component-router data-bind="css: { opacity: loading() ? .5 : 1 }"></ko-component-router>
```

[More](./docs)
