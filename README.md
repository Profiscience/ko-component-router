# ko-component-router

[![Version][npm-version-shield]][npm]
[![License][wtfpl-shield]][wtfpl]
[![Build Status][travis-ci-shield]][travis-ci]
[![Coverage States][codecov-shield]][codecov]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Greenkeeper Status][greenkeeper-shield]][greenkeeper]
[![Downloads][npm-stats-shield]][npm-stats]
[![Gitter][gitter-shield]][gitter]

Super-duper flexible component based router + middleware framework for developing wicked awesome single page apps with [KnockoutJS][]

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

[KnockoutJS]: https://knockoutjs.com

[npm]: https://www.npmjs.com/package/ko-component-router
[npm-version-shield]: https://img.shields.io/npm/v/ko-component-router.svg?style=for-the-badge

[wtfpl]: ./LICENSE.md
[wtfpl-shield]: https://img.shields.io/npm/l/ko-component-router.svg?style=for-the-badge

[travis-ci]: https://travis-ci.org/Profiscience/ko-component-router/
[travis-ci-shield]: https://img.shields.io/travis/Profiscience/ko-component-router/master.svg?style=for-the-badge

[codecov]: https://codecov.io/gh/Profiscience/ko-component-router
[codecov-shield]: https://img.shields.io/codecov/c/github/Profiscience/ko-component-router.svg?style=for-the-badge

[david-dm]: https://david-dm.org/Profiscience/ko-component-router
[david-dm-shield]: https://img.shields.io/david/Profiscience/ko-component-router.svg?style=for-the-badge

[david-dm-peer]: https://david-dm.org/Profiscience/ko-component-router#info=peerDependencies&view=table
[david-dm-peer-shield]: https://img.shields.io/david/peer/Profiscience/ko-component-router.svg?style=for-the-badge?maxAge=2592000

[greenkeeper]: https://greenkeeper.io/
[greenkeeper-shield]: https://badges.greenkeeper.io/Profiscience/ko-component-router.svg?style=for-the-badge

[npm-stats]: http://npm-stat.com/charts.html?package=ko-component-router&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/ko-component-router.svg?style=for-the-badge&maxAge=2592000

[gitter]: https://gitter.im/Profiscience/ko-component-router
[gitter-shield]: https://img.shields.io/gitter/room/profiscience/ko-component-router.svg?style=for-the-badge
