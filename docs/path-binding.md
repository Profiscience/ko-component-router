# Path Binding

For your convenience, the router includes a binding called `path` that allows
you to set the href of anchor tags without mucking around with the base path
and having to juggle different levels too much.

__Basic__
```html
<a data-bind="path: '/foo'">
```

This will route to the `/foo` route on the most immediate router, i.e.
a router in the same component, or the containing router.

__Absolute__
```html
<a data-bind="path: '//foo'">
```

This will route to the `/foo` route at the top-level router.

__Relative__
```html
<a data-bind="path: '../foo'">
```

This will route to the `/foo` route at the parent router.

---

Words to the wise... use absolute paths. It's much easier.
