# Router

## API

### Instance

#### router.ctx
Current [router context](./context.md) object

#### router.isNavigating()
Observable value that is true if router is navigating

#### router.isRoot
Is the root router

#### router.update(path, push = true)
Routes to `path`; adds history state entry if `push === true`

### Static

#### Router.get(index)
Return router at the given depth, beginning at 0

#### Router.head
Top-most router

#### Router.tail
Deepest router

#### Router.use(fn)
Convenience function for `Router.middleware.push(fn)`

#### Router.usePlugin(fn)
Convenience function for `Router.plugins.push(fn)`

#### Router.update(path, push = true)
Convenience function for `Router.get(0).update(path, push)`

#### Router.config.base = ''
Base path that the router is active under

#### Router.config.hashbang = false
Using hashbang routing

#### Router.middleware = []
Global middleware

#### Router.plugins = []
Router plugins

#### Router.routes = {}
Routes for top-level router

---

[Back](./README.md)
