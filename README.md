# ko-component-router
Component-based router for developing single-page-apps with KnockoutJS,
built on top of [page.js](https://github.com/visionmedia/page.js). Any gaps in this
documentations will most likely be quickly answered by a quick look at page.js' docs.

__v2.0.0 is a complete rewrite and is currently in development__

```javascript
ko.router.route('/user/:id', loadUser, 'User')
```

## Installation
```shell
npm install ko-component-router
bower install caseyWebb/ko-component-router
```

_Note for CommonJS / AMD users: requiring this modules adds it to the `ko` namespace, i.e._
```javascript
require('knockout-component-router')

var ko = require('knockout')

ko.router // the router
```

## API

### ko.router.route(path, [callback ...], componentName, [callback ...])
Defines a route mapping path to the given [route stack](#route-stack)

### ko.router.start(config)
Starts the router with the defined [config](#configuration)

_You want to run this after registering all your routes so that the router will not
novigate away as soon as it is started_

### ko.router.show(path)
Navigate to `path` and add history entry

### ko.router.redirect(path)
Redirect to `path` without adding history entry

## Configuration
```javascript
{
  // HTML4-safe routing
  hashbang: false,

  // Base path to route from,
  // e.g. 'app/', if your app is running under an /app/ subdirectory
  basePath: ''
}
```

## Route Stack
In the simplest case, you need only pass the name of the component to show for the route.
This route will be initialized with it's `params` set to an observable of the current [context](https://github.com/visionmedia/page.js#context)
```javascript
ko.router.route('/home', 'Home')

function HomeViewModel(ctx) {
  // ctx.params
  // ctx.state
  // etc...
}
```

However, you also have the option of passing functions before, or after the component name.
Each function will be passed two arguments, a [context](https://github.com/visionmedia/page.js#context),
and a callback function.

```javascript
ko.router.route('/user:id', showLoader, loadUser, 'User', hideLoader)

function loadUser(ctx, next) {
  $.get('API/User/' + ctx.params.id)
    .done(function(res) {
      ctx.state.user = res
      ctx.save()
      // see https://github.com/visionmedia/page.js#working-with-state
      next()
    })
}

function showLoader(ctx, next) {
  $('#loader').show()
}

function hideLoader(ctx, next) {
  $('#loader').hide()
}
```

## Parameters / Route Matching, State, Middleware, 404 behavior
Consult [page.js' documentation](https://github.com/visionmedia/page.js), it probably
has your answer. If not, feel free to email me at [notcaseywebb@gmail.com](mailto:notcaseywebb@gmail.com).

## TODO / Roadmap
- tests
- nested routing

## License
This library is released under the MIT License as follows

The MIT License (MIT)

Copyright (c) 2015 Casey Webb

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
