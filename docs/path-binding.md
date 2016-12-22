# Path Binding

For your convenience, the router includes a binding called `path` that allows
you to set the href of anchor tags without mucking around with the base path
and having to juggle different levels too much.

### Local
```html
<a data-bind="path: '/foo'">
```

This will route to the `/foo` route on the current router (the one that this
page belongs to).

### Absolute
```html
<a data-bind="path: '//foo'">
```

This will route to the `/foo` route at the top-level router.

### Relative
__parent__
```html
<a data-bind="path: '../foo'">
```

This will route to the `/foo` route at the parent router.

__child__
```html
<a data-bind="path: './foo'">
```

This will route to the `/foo` route at the child (adjacent) router.

---

[Back](./)
