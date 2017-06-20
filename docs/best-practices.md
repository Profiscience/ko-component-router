# Best Practices

Use plugins liberally to set up an architecture for your app. For example, create
plugins for...
  - setting the document title
  - creating breadcrumbs (with nested routing)
  - creating/attaching a scoped [querystring](https://github.com/Profiscience/ko-querystring) object
  - loading components on demand
  - loading data
  - loading/disposing styles

---

Abstract your data loading into middleware or a plugin. This makes dealing with data across
nested routers painless, and prevents you from needing to implement a loading animation on
each page. Instead, handle loading animation via another middleware using lifecycle events —
start the loader at the beginning of the middleware execution in `beforeRender`,
and stop it in the `afterRender`.

For a contrived example of this, you could create a data plugin that enables you
to have route configs like...

```javascript
export default {
  component: 'component-name',
  api: '/api/some/api/endpoint'
}
```

Your `api` plugin could then accumulate any necessary params from `ctx.params` and
`ctx.$parents` params and attach the result to ctx. This is then available in the view
as well as children (unless queued) and the data will be fetched before navigation occurs,
meaning no intermediate white space.

When combined with a [querystring](https://github.com/Profiscience/ko-querystring),
you can achieve very little boilerplate, convention-over-configuration views that
*just have* their data with minimal effort from you.

Note, this is a contrived example. A better method is to create a model class and a
plugin that understands it. In our case, views look like...

```javascript
const COURSE_TYPES = new Map([
  ['/', 0],
  ['/on-demand', 1],
  ['/live', 2],
  ['/assessment', 4]
])

export default {
  query: {
    searchText: '',
    sort: 'p'
  },
  routes: {
    '/:type': {
      query: {
        createQueryFactory(ctx) {
          const q = ctx.$parent.query
          q.set({ courseType: COURSE_TYPES.get(ctx.pathname) })
          return q
        }
      },
      collection: () => import('./collection'),
      component: () => ({
        template: import('./Courses.html'),
        viewModel: import('./Courses')
      })
    }
  }
}
```

With `collection.js` being

```javascript
import { collectionConstructorFactory } from 'utils/collection'

export default collectionConstructorFactory({ api: '/api/courses' })
```

Which sets up a class with a static `.factory(params)` function, and the
collection plugin — `collection: () => import('./collection')` — is responsible
for calling the function that
  a) asynchronously loads the model js file via webpack & `import()`
  b) calls the `factory` function with the route params and query
  c) attaches the instantiated collection to `ctx.collection`

---

Use `synchronous: true` on your view components.

---

For large SPAs, use the router to load assets on demand via middleware/plugins. This can
be seen above with the functions that return a promise via `import()`.

---

The router plays nice with `ko.options.deferUpdates`, and its usage is highly recommended.

---

Check out the [examples](../examples)!

---

[Back](./README.md)
