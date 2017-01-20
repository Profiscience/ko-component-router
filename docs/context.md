# Context

The context object contains several properties attached by the router, as well
as any params other than `routes` or `base` passed into the router component,
and any additional data attached by middleware (if applicable).

## API

#### ctx.element
DOM Element for the view container

#### ctx.router
Router that the current page belongs to

#### ctx.route
Current route instance

#### ctx.path
The current path

#### ctx.pathname
The current path, excluding child path

#### ctx.params
Object containing route parameters

#### ctx.$parent
Parent context accessor

#### ctx.$parents
Array of parent contexts

#### ctx.$child
Child context accessor

#### ctx.$children
Array of child contexts

#### ctx.addBeforeNavigateCallback(([done]) => done())
Adds a function to be executed before the page is navigated away from. Callbacks
are executed LIFO. Async callbacks should use the optional `done` parameter
to continue to the next callback (if any), or navigation.

#### ctx.queue(promise)
Only available in `beforeRender` [middleware](./middleware.md), this function
queues a promise and allows middleware to continue running, but still resolves
before the page is rendered.

A callback may prevent navigation by
- returning `false`
- returning a promise that a) is rejected or b) resolves `false`
- calling `done(false)`

---

[Back](./README.md)
