import isFunction from 'lodash-es/isFunction'
import isUndefined from 'lodash-es/isUndefined'
import isPlainObject from 'lodash-es/isPlainObject'
import noop from 'lodash-es/noop'
import startsWith from 'lodash-es/startsWith'
import { Context } from './context'
import { Router, Middleware, LifecycleGeneratorMiddleware } from './router'

export { default as isArray } from 'lodash-es/isArray'
export { default as isBoolean } from 'lodash-es/isBoolean'
export { default as isFunction } from 'lodash-es/isFunction'
export { default as isPlainObject } from 'lodash-es/isPlainObject'
export { default as isString } from 'lodash-es/isString'
export { default as isUndefined } from 'lodash-es/isUndefined'
export { default as castArray } from 'lodash-es/castArray'
export { default as concat } from 'lodash-es/concat'
export { default as extend } from 'lodash-es/extend'
export { default as extendWith } from 'lodash-es/extendWith'
export { default as filter } from 'lodash-es/filter'
export { default as flatMap } from 'lodash-es/flatMap'
export { default as map } from 'lodash-es/map'
export { default as mapValues } from 'lodash-es/mapValues'
export { default as reduce } from 'lodash-es/reduce'

export type AsyncCallback<T> = (done?: (t: T) => void) => Promise<T> | void
export type SyncCallback<T> = () => T
export type Callback<T> = AsyncCallback<T> | SyncCallback<T>

export async function sequence(callbacks: Callback<boolean | void>[], ...args: any[]): Promise<{
  count: number,
  success: boolean
}> {
  let count = 0
  let success = true
  for (const _fn of callbacks) {
    count++
    const ret = await promisify(_fn)(...args)
    if (ret === false) {
      success = false
      break
    }
  }
  return { count, success }
}

export function traversePath(router: Router, path: string) {
  if (path.indexOf('//') === 0) {
    path = path.replace('//', '/')

    while (!router.isRoot) {
      router = router.ctx.$parent.router
    }
  } else {
    if (path.indexOf('./') === 0) {
      path = path.replace('./', '/')
      router = router.ctx.$child.router
    }

    while (path && path.match(/\/?\.\./i) && !router.isRoot) {
      router = router.ctx.$parent.router
      path = path.replace(/\/?\.\./i, '')
    }
  }

  return { router, path }
}

export function resolveHref({ router, path }: { router: Router, path: string }) {
  return router.ctx.base + path
}

export function isActivePath({ router, path }: { router: Router, path: string }): boolean {
  let ctx = router.ctx
  while (ctx) {
    // create dependency on isNavigating so that this works with nested routes
    // inside a computed
    ctx.router.isNavigating()

    if (ctx.$child ? startsWith(path, ctx.pathname) : path === ctx.pathname) {
      path = path.substr(ctx.pathname.length) || '/'
      ctx = ctx.$child
    } else {
      return false
    }
  }
  return true
}

export function isGenerator(x: any) {
  return x.constructor.name === 'GeneratorFunction'
}

export function isThenable(x: any) {
  return !isUndefined(x) && isFunction(x.then)
}

export function promisify(_fn: (...args: any[]) => void = noop): (...args: any[]) => Promise<any> {
  return async (...args) => {
    const fn = () =>
      _fn.length === args.length + 1
        ? new Promise((r) => {
          _fn(...args, r)
        })
        : _fn(...args)

    const ret = fn()

    return isThenable(ret)
      ? await ret
      : ret
  }
}

export function castLifecycleObjectMiddlewareToGenerator(fn: Middleware): LifecycleGeneratorMiddleware {
  return isGenerator(fn)
    ? fn as LifecycleGeneratorMiddleware
    : async function *(ctx: Context) {
      const ret = await promisify(fn)(ctx)

      if (isPlainObject(ret)) {
        yield await promisify(ret.beforeRender)()
        yield await promisify(ret.afterRender)()
        yield await promisify(ret.beforeDispose)()
        yield await promisify(ret.afterDispose)()
      } else {
        yield ret
      }
    }
}
