# TypeScript Support

If you're using TypeScript — *as you most definitely should be* — you're in luck! The router is written with first-class support for TypeScript.

That being said, it isn't immediately obvious how to take advantage of type-safety if you use middleware and plugins that extend the context.

Let's say you want to have some middleware that sets a `data` property on the context, like so...

```javascript
import { Router } from 'ko-component-router'

Router.use(async (ctx) => {
  ctx.data = await fetchSomeData()
})
```

Because `ctx` is strongly-typed, we get an error as expected...

> Property 'data' does not exist on type 'Context & IContext'

We could use the dirty `(ctx as any).data = ...` hack that anyone who has used TypeScript for more than a day has undoubtedly had to use, but it would be way better if we could let the compiler know about the new property so we get all the benefits type-safety brings to the table like autocompletion. To do this, it's as simple as adding a `declare` statement to our middleware file, like so...

```typescript
import { Router } from 'ko-component-router'

declare module 'ko-component-router' {
  interface IContext {
    data?: MyDataType
  }
}

Router.use(async (ctx) => {
  ctx.data = await fetchSomeData()
})
```

That's it! If `fetchSomeData()` returns something of the wrong type, the compiler will throw an error, and in your component viewModels, you will have full autocomplete of your custom properties.

**NOTE:** It's an interface prefixed with `I`, *not* the normal `Context` class. This is because TypeScript does not support declaration merging on classes.

You may also take advantage of some types that are exported, namely `RouteConfig`, `RouteMap`, `Middleware`, and `Plugin`. You can use these to specify types where the compiler cannot otherwise infer them. For example...

```typescript
import { Plugin } from 'ko-component-router'

declare module 'ko-component-router' {
  interface IContext {
    data: string
  }
}

const apiPlugin: Plugin = ({ apiUrl }) => async (ctx) => {
  ctx.data = await $.get(apiUrl)
}

export default apiPlugin
```