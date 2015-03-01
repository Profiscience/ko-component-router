# ko-component-router
Component-based router for developing single-page-apps with KnockoutJS

#### Installation
This package can be installed via bower or npm under the alias ko-component-router. It is wrapped in a universal module definition and thus may be consumed as a CommonJS/AMD module, or global.

#### Usage
Using the router is as simple as including it in your index.html or equivalent and passing it routes, as well as any config.

The best way to demonstrate usage is to show a simple example, and then dive into how everything is working and the API, so that is what we shall do.

__Example__
```html
<script>
    ko.components.register('Home', {
        template: '<h1>I am the home page</h1>'
    })

    ko.components.register('Users', {
        viewModel: function() {
            function UsersViewModel() {
                this.ready(false)
                this.init()
            }

            UsersViewModel.prototype.init = function() {
                $.get('/api/users', function(users) {
                    this.users = ko.mapping.fromJS(users)
                    this.ready(true)
                }.bind(this))
            }

            return UsersViewModel
        }(),

        template: { element: 'users-page' }
    })

    ko.components.register('User', {
        viewModel: function() {
            function UserViewModel(params) {
                this.ready(false)
                this.id = params.id // passed in from router
                this.init()
            }

            UserViewModel.prototype.init = function() {
                $.get('/api/user/' + this.id, function(user) {
                    this.user = ko.mapping.fromJS(user)
                    this.ready(true)
                }.bind(this))
            }

            return UserViewModel
        },

        template: { element: 'user-page' }
    })

    ko.applyBindings({
        routes: {
            '/home':        'Home',
            '/user':        'Users',
            '/user/:id':    'User'
        }
    })
</script>
<body>
    <ko-component-router params="routes: routes"></ko-component-router>

    <template id="users-page">
        <ul data-bind="if: ready, foreach: users">
            <li>
                <a data-bind="text: name, attr: { href: '/user/' + id }"></a>
            </li>
        </ul>
    </template>

    <template id="user-page">
        <span data-bind="if: ready, text: user.name"></span>
    </template>
</body>
```

So, as you can -- hopefully -- see, it all begins with an app view model that contains the routes object in which the keys are the routes, and the values are the name of the component for that page.

A `params` object is passed to the viewModel constructor function that contains any route params, as well as querystring params.

###### Defining Routes
Routes are defined such as key == route (in express router syntax) and value == component name

`'/user/:id'` will match routes such as `/user/1` or `/user/caseyWebb`,
and `params.id` would equal `1` or `caseyWebb`, respectively

Optional parameters should have `?` suffixed, so that the route will still match when a parameter is not supplied, e.g.

`'/tabbed-page/:tab?` will match `/tabbed-page`, as well as `/tabbed-page/tab`,
in the case of `/tabbed-page`, `params.tab` will be null, and in `/tabbed-page/tab`, `params.tab` will be equal to `'tab'`

###### Options
Options may be supplied to the router component as well as the routes as follows

`<ko-component-router params="routes: routes, options: opts" />`

The following options are available (with their default values shown)

```javascript
var opts = {
    // whether or not hashbang (!#) routing should be used
    // to support HTML4 browsers (legacy IE)
    hashbang:           false,

    // it is good practice to prefix your view components
    // with something such as `app-view-home`, `app-view-about`.
    // in this case you could prevent having to type out 'app-view-'
    // in each of your routes by supplying it via this option
    componentPrefix:    '',

    // when your application is in a nested basepath,
    // you must specify the basepath. When hashbang
    // routing is used, this can be inferred without
    // specifying
    basePath:           '/'
}
```

###### API
In addition to the `<ko-component-router>` component, this library adds `router` to the `ko` namespace, and exposes the following api:

`ko.router.show(path)`  
Navigates to the specified path

`ko.router.redirect(path)`  
Redirects to the specified path without adding a new history entry

`ko.router.exit(path, callback)`  
Defines an exit callback for the given path. Generally, you should use a dispose function on the viewModel rather than this.

`ko.router.state`  
This is a knockout observable that contains the state object and may be read or written. It depends on the native HTML5 history API, so to use in legacy browsers you should polyfill with [HTML5-History-API](https://github.com/devote/HTML5-History-API).

`ko.router.utils.subscribe([observables], fn, _optional_ subscriptionName)`  
This is a convenience method for subscribing one or more observables to a function. It ensures that any manual subscriptions are properly disposed of when the page is changed. The optional subscriptionName parameter allows you to create named subscriptions that can be undone using `ko.router.unsubscribe` below.

The reasoning behind using this rather than the native `observable.subscribe` is to prevent residual subscriptions from causing the viewModel to be held in memory, causing odd and unforeseen bugs when changing pages. For more on this, I suggest reading [this](http://knockoutjs.com/documentation/component-binding.html#disposal-and-memory-management).

`ko.router.utils.unsubscribe([observables], _optional_ subscriptionName)`  
Removes the named subscription for the provided observables. If subscriptionName is not supplied, all subscriptions added using `ko.router.subscribe` are removed.

#### Contributing
PRs and bug reports are welcomed. Commits should be single purpose and clearly labeled. In lieu of a formal style guide, style should remain consistent with existing codebase; please limit line lengths to ~80 chars unless it improves clarity and readability.

###### TODO
- write specs
- support nested routers
