# ko-component-router

[![NPM Version](https://img.shields.io/npm/v/ko-component-router.svg)](https://www.npmjs.com/package/ko-component-router)
![WTFPL](https://img.shields.io/npm/l/ko-component-router.svg)
[![Travis](https://img.shields.io/travis/Profiscience/ko-component-router.svg)](https://travis-ci.org/Profiscience/ko-component-router)
[![Coverage Status](https://coveralls.io/repos/github/Profiscience/ko-component-router/badge.svg?branch=master)](https://coveralls.io/github/Profiscience/ko-component-router?branch=master)
[![Dependency Status](https://img.shields.io/david/Profiscience/ko-component-router.svg)](https://david-dm.org/Profiscience/ko-component-router)
[![Peer Dependency Status](https://img.shields.io/david/peer/Profiscience/ko-component-router.svg?maxAge=2592000)](https://david-dm.org/Profiscience/ko-component-router#info=peerDependencies&view=table)
[![NPM Downloads](https://img.shields.io/npm/dt/ko-component-router.svg?maxAge=2592000)](http://npm-stat.com/charts.html?package=ko-component-router&author=&from=&to=)
[![Gitter](https://img.shields.io/gitter/room/profiscience/ko-component-router.svg)](https://gitter.im/Profiscience/ko-component-router)

Super duper flexible component based router for developing wicked awesome single page apps with KnockoutJS.

[Migrating from 3.x to 4.x](https://github.com/Profiscience/ko-component-router/wiki/Migrating-from-3.x-to-4.x).

### Installation
```bash
$ yarn add ko-component-router
```
...or...
```bash
$ npm install -S ko-component-router
```

### Basic Usage
```javascript
import ko from 'knockout'
import 'ko-component-router'

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
    <ko-component-router params="routes: routes"></ko-component-router>
  `
})

ko.component.register('home', {
  template: `<a href="/users/1234">Show user</a>`
})

ko.components.register('user', {
  viewModel: class User {
    constructor(ctx) {
      // ctx.params
      //
      // ...and more!
    }
  }
})

ko.applyBindings()
```

[More](./docs)
