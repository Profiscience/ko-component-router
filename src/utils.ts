import Router, { Middleware } from './router'

import isFunction from 'lodash-es/isFunction'
import isUndefined from 'lodash-es/isUndefined'
import noop from 'lodash-es/noop'

export { default as isArray } from 'lodash-es/isArray'
export { default as isBoolean } from 'lodash-es/isBoolean'
export { default as isFunction } from 'lodash-es/isFunction'
export { default as isPlainObject } from 'lodash-es/isPlainObject'
export { default as isString } from 'lodash-es/isString'
export { default as isUndefined } from 'lodash-es/isUndefined'
export { default as castArray } from 'lodash-es/castArray'
export { default as extend } from 'lodash-es/extend'
export { default as extendWith } from 'lodash-es/extendWith'
export { default as flatMap } from 'lodash-es/flatMap'
export { default as map } from 'lodash-es/map'
export { default as mapValues } from 'lodash-es/mapValues'
export { default as reduce } from 'lodash-es/reduce'

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