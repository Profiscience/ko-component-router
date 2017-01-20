# Changelog

## [Unreleased]

none :tada:

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
