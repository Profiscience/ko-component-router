# ko-component-router
Component-based router for developing single-page-apps with KnockoutJS

## Installation
This package can be installed via bower or npm under the alias ko-component-router. It is wrapped in a universal module definition and thus may be consumed as a CommonJS/AMD module, or global.

_Requires KnockoutJS >= 3.3.0_

#### CommonJS (Browserify) / AMD (RequireJS) Note
KnockoutJS relies on the same ko context being used througout the app, so you will have to either create a singleton for ko, or attach it to the window and pass that as the first argument to `start`.

## Usage

#### Getting Started
Using the router is as simple as defining your routes and starting the router, passing it your knockout context (see above), routes, and -- optionally -- any options. 

_Examples are shown in CommonJS_

Ex.
__main.js__
```javascript
var routes = {
    '/user':     'UsersComponent',
    '/user/:id': 'UserComponent'
}

var router = require('ko-component-router')

// ko.router is undefined
router.start(window.ko, routes, options)
// ko.router is defined
// <ko-component-router> component is now available
```

__index.html__
```html
<body>
    <!-- Router will display the active page here -->
    <ko-component-router></ko-component-router>
</body>
```

#### Defining Routes
Routes are defined such as key == route (in express router syntax) and value == component name

Routes are matched according to specificity, not order, so given the following routes...
```javascript
var routes = {
    '/user/:id/tab?': 'UserComponent',
    '/user/:id/edit': 'UserEditComponent'
} 
```
...navigating to `/user/1234/edit` will show the `UserEditComponent` rather than passing in `edit` for the tab parameter.

`'/user/:id'` will match routes such as `/user/1` or `/user/caseyWebb`,
and `params.id` would equal `1` or `caseyWebb`, respectively

Optional parameters should have `?` suffixed, so that the route will still match when a parameter is not supplied, e.g.

`'/tabbed-page/:tab?` will match `/tabbed-page`, as well as `/tabbed-page/tab`,
in the case of `/tabbed-page`, `params.tab` will be null, and in `/tabbed-page/tab`, `params.tab` will be equal to `'tab'`

#### Parameters
Route params are bound to the component's `params` and are passed to the component viewModel constructor. See the [knockout component binding](http://knockoutjs.com/documentation/component-binding.html) for more.

#### Options
Options may be supplied to the router component as well as the routes as follows

The following options are available (with their default values shown)

```javascript
var opts = {
    // Whether or not pushState should be used rather than
    // hash fragments.
    //
    // NOTE: this does NOT degrade gracefully. If you wish to
    // target older versions of IE, you must polyfill the 
    // History API as described below and use hashbang routing
    // exclusively
    HTML5: false,

    // when your application is in a nested basepath,
    // you must specify the basepath. When hashbang
    // routing is used, this will not be used and instead inferred
    // by window.location.pathname
    basePath: '/'
}
```

#### API
`start`  
Starts the router and adds `router` to `ko`

`ko.router.show(path)`  
Navigates to the specified path

`ko.router.redirect(path)`  
Redirects to the specified path without adding a new history entry

`ko.router.state`  
This is a knockout observable that contains the state object and may be read, written, or subscribed to

#### Navigating with a base path
Paths, including those on anchors, should not contain the base path. So, if you are running your app under the base path `/my/app`, both of the following will navigate to `/my/app/is/awesome`

```html
<a href="/is/awesome">My app is awesome</a>
```

```javascript
ko.router.show('/is/awesome')
```

#### 404 Behavior
If a matching route is not found for an anchor click, the browser will navigate away to the path. This allows you to use external links without modifying anything.

## <IE10
If you need to support browsers without pushstate (I'm sorry...), you must use HTML4 (hashbang) routing -- on by default -- and drop the following line into your HTML.

```html
<!--[if lte IE 9]><script src="//cdnjs.cloudflare.com/ajax/libs/html5-history-api/4.0.2/history.iegte8.min.js?type=!/"></script><![endif]-->
```

If you're wondering, that's [this History API polyfill](https://github.com/devote/HTML5-History-API) from [cdnjs](cdnjs.com) with IE conditional comments and an extra argument to get the `#!` instead of just `#` (this is not optional).

__Can I use another History polyfill?__
Don't.

__But if I'm using hashbang routing, why do I even need to polyfill the History API?__
The router depends on the state abstraction provided on ko.router.state, and the state abstraction relies on, well, history state.

__Can I gracefully degrade so modern browsers use pushstate?__
Yes, but this package isn't going to do that for you. It's recommended that you use the same routing strategy for all clients.

## Contributing
PRs and bug reports are welcomed. Commits should be single purpose and clearly labeled. Tests should be added if it makes sense, and you obviously shouldn't break any other tests. In lieu of a formal style guide, style should remain consistent with existing codebase (ahem, some syntactic sugar is just noise); please limit line lengths to ~80 chars unless it improves clarity and readability.

## TODO / Roadmap
- examples
- support nested routers

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
