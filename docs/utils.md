# Utils

## API

#### isActivePath({ router, path })
Returns `true` if `path` for `router` is currently active

#### resolveHref({ router, path })
Gets an absolute path for `path` on `router`

#### traversePath(router, path)
Resolves `path` in relation to `router`

###### Local
'/foo' route to the `/foo` route on `router`

###### Absolute
'//foo' will route to the `/foo` route on `router.$root`

###### Relative
__parent__
'../foo' will route to the `/foo` route on `router.$parent`

__child__
'./foo'  will route to the `/foo` route on `router.$child`
