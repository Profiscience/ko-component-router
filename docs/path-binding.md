# Path Binding

For your convenience, the router includes a binding called `path` that allows
you to set the href of anchor tags without mucking around with the base path
and having to juggle different levels too much.

**NOTE:** The path binding sets the href attribute, so it will only work on anchor
tags for navigation. However, it can be used on any element for styling.

Parses path using [utils.traversePath](./utils.md#traversePath)

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


## Styling Elements
By default, the router adds the `active-path` css class to any anchor with a
path binding that resolves to the current page. To use a class other than
`active-path`, you may configure it globally in the router's config as
`activePathCSSClass`, or use the supplementary `pathActiveClass` binding.

```html
<a data-bind="path: '/foo', pathActiveClass: 'foo-active'">
```

---

[Back](./)
