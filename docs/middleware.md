# Middleware

The real power and extensibility of the router comes in the form of middleware.
In this case, middleware is a series of functions, sync or async, that compose a
route. In fact, the actual component setting is merely a middleware function that
sets the router component.

If used correctly, you can have complete control over the lifecycle of each view
and keep your viewmodel as slim as possible (think skinny controllers, fat models).

## Registering Middleware

### App

App middleware is ran for every route and is registered using `Router.use`,
or if you use a module system you may prefer something to the effect of...

```javascript
import Router from 'ko-component-router'

Router.use(fn)
```

### Route

First, let's look at some code...

This...

```javascript
{
  '/user/:id': 'user'
}
```

...is really just shorthand for...

```javascript
{
  '/user/:id': ['user']
}
```

...which is _really_ just shorthand for...

```javascript
{
  '/user/:id': [(ctx) => ctx.router.component('user')]
}
```

...so with that in mind, let's talk route middleware.

As you can — hopefully — see, each route boils down to an array of functions: middleware.

To add middleware to a route, simply add it to the array...

```javascript
{
  '/user/:id': [
    fn,
    'user'
  ]
}
```

__NOTE:__ I'm not going to stop you from putting functions *after* the component,
but I __highly__ discourage it. There is a better way... keep reading...

## Middleware Functions

Middleware functions are passed 2 arguments:
- `ctx`: the ctx object passed into the viewmodel
- `done`: an optional callback for async functions; promises are also supported, and encouraged

Let's look at some example logging middleware...

```javascript
import Router from 'ko-component-router'

Router.use((ctx) => console.log('[router] navigating to', ctx.pathname))
```

But wait, there's more!

Take our users route from earlier, and let's posit that you're trying to refactor
your data calls out of the viewmodel...

```javascript
{
  '/user/:id': [
    (ctx) => getUser().then((u) => ctx.user = u),
    'user'
  ]
}
```

In the viewmodel for the `user` component, `ctx.user` will contain the user. Since
we're returning a promise, the next middleware (in this case the component setter)
will not be executed until after the call has completed.

Let's see how we can take some finer control. As has been the theme, you've got options...

### Lifecycle Object
You can return an object from your middleware that contains functions to be executed
at different points in the page lifecycle.

```javascript
import Query from 'ko-query'

function(ctx) {
  return {
    beforeRender(/* done */) {
      console.log('[router] navigating to', ctx.pathname)
      ctx.query = new Query({}, ctx.pathname)

      return loadSomeAsyncData.then((data) => {
        ctx.data = data

        // callbacks are also supported
        // done()
      })
    },
    afterRender() {
      console.log('[router] navigated to', ctx.pathname)
      $(ctx.element).fadeIn()
    },
    beforeDispose() {
      console.log('[router] navigating away from', ctx.pathname)
      $(ctx.element).fadeOut()
    },
    afterDispose() {
      console.log('[router] navigated away from', ctx.pathname)
      ctx.query.dispose()
    }
  }
}
```

You may be wondering, "why a function returning an object instead of just an object?"

Well, if you read the docs on nested routing, you'll see that you can define routes
by passing an object to a route. To avoid _too much_ polymorphism that could cause
confusion, this was the ideal approach. It also enables dynamic middleware and
more meta-programming opportunities.

### Generator Middleware
Now for the real fun — in my humble opinion, of course —, generator middleware.

If you're unfamiliar with generators, [read up](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*),
but fear not. In short, they are functions that are able to suspend and resume
execution.

Let's write the same `monolithicMiddleware` with a generator, then walk through what is going on...

```javascript
import Router from 'ko-component-router'
import Query from 'ko-query'

function * monolithicMiddleware(ctx) {
  console.log('[router] navigating to', ctx.pathname)
  ctx.query = new Query({}, ctx.pathname)
  yield loadSomeAsyncData().then((data) => ctx.data = data)

  console.log('[router] navigated to', ctx.pathname)
  $(ctx.element).fadeIn()
  yield

  console.log('[router] navigating away from', ctx.pathname)
  $(ctx.element).fadeOut()
  yield

  console.log('[router] navigated away from', ctx.pathname)
  ctx.query.dispose()
}

Router.use(monolithicMiddleware)
```

_Hopefully_ it's pretty obvious what is going on here, but if not, I'll elaborate.

Generator middleware is expected to yield up to 3 times, and will be resumed at
the same points in the lifecycle: beforeRender, afterRender, beforeDispose, and afterDispose.

Function entry to the first `yield` contains logic to be executed before the component
is initialized, the second just after render, the third just before dispose, and the last
just after.

Yielding a promise is supported for async operations.

I :heart: future JS.

## Execution Order

Middleware is executed in the following order...

- App before render
- Route before render
- App after render
- Router after render
- [before navigate callbacks]
- Route before dispose
- App before dispose
- Route after dispose
- App after dispose

---

[Back](./)
