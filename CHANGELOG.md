# Changelog

## [Unreleased]

:tada:


## 4.4.4

### Fixed
 - deeply nested child afterDispose middleware not being called


## 4.4.3

### Fixed
 - querystring and hash being wiped out in child routes on popstate
 - child afterDispose middleware not being called


## 4.4.2

### Fixed
 - Navigating to same route w/ different params caused issues w/ middleware execution order — #164


## 4.4.1

### Added
 - examples! :beers:

### Fixed
 - Basepath not working correctly with hashbang (appended instead of prepended) — #156
 - Landing on `/` in hashbang mode did not redirect to `/#!/`


## 4.4.0

### Added
 - Router.initialized

### Fixed
 - afterRender middleware in child routers being ran twice
 - path binding not usable from <ko-component-router> parent component when wrapped — #157


## 4.3.1

### Fixed
 - Navigating to url w/ query or hash wiped out said query or hash


## 4.3.0

### Added
 - Router.setConfig
 - Router.useRoutes
 - router.$parents
 - ctx.$parents
 - router.$children
 - ctx.$children

### Fixed
 - Options to router.update were not being passed down to children when applicable
 - Child afterRender middleware was not being ran when parent navigated away


## 4.2.0

### Added
  - `with` option for router.update


## 4.1.0

### Added
 - Router.head and Router.tail accessors


## 4.0.1

### Changed
 - Middleware execution order; beforeRender middleware is now called _before_
 preceding page's afterRender, preventing a blank page while async middleware is
 executing

### Fixed
 - IE9-11 pathname parsing [#132](https://github.com/Profiscience/ko-component-router/pull/132)


## 4.0.0
See [Migrating from 3.x to 4.x](https://github.com/Profiscience/ko-component-router/wiki/Migrating-from-3.x-to-4.x)
