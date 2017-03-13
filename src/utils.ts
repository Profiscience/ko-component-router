import { isFunction, isUndefined, noop } from 'lodash-es'
import Router, { Middleware } from './router'

export type AsyncCallback = (done?: Function) => void | Promise<any>

export async function sequence(callbacks: AsyncCallback[], ...args) {
  for (const _fn of callbacks) {
    if (await promisify(_fn)(...args) === false) {
      return false
    }
  }
}

export function isGenerator(x) {
  return x.constructor.name === "GeneratorFunction"
}

export function isThenable(x) {
  return !isUndefined(x) && isFunction(x.then)
}

export function promisify(_fn: Function = noop) {
  return async(...args) => {
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
  };
}
