import { isFunction, isUndefined, noop } from 'lodash-es'
import { Middleware } from './router'

export type AsyncCallback = (done?: Function) => void | Promise<any>

export function runMiddleware(middleware: Array<Middleware>, ...args): [
  Promise<any>,
  () => Promise<any>
] {
  const downstream = []

  const callbacks = middleware.map((fn) => {
    const runner = generatorify(fn)(...args)
    const run: AsyncCallback = async () => {
      let ret = runner.next()
      ret = isThenable(ret)
        ? await ret
        : ret.value
      return ret || true
    }
    downstream.push(run)
    return run
  })

  return [
    sequence(callbacks, ...args),
    () => sequence(callbacks, ...args)
  ]
}

export async function sequence(callbacks: Array<AsyncCallback>, ...args) {
  for (const _fn of callbacks) {
    if (await promisify(_fn)(...args) === false) {
      return false
    }
  }
}

function isGenerator(x) {
  return x.constructor.name === 'GeneratorFunction'
}

function isThenable(x) {
  return !isUndefined(x) && isFunction(x.then)
}

// ts why u no haz async generators?? babel why ur generators so $$$?????
function generatorify(fn) {
  return isGenerator(fn)
    ? fn
    : function(...args) {
      let count = 1, ret
      return {
        async next() {
          switch (count++) {
          case 1:
            ret = await promisify(fn)(...args) || false
            return ret && ret.beforeRender
                  ? await promisify(ret.beforeRender)()
                  : ret
          case 2: return ret && await promisify(ret.afterRender)()
          case 3: return ret && await promisify(ret.beforeDispose)()
          case 4: return ret && await promisify(ret.afterDispose)()
          }
        }
      }
    }
}

// function generatorify(fn) {
//   return isGenerator(fn)
//     ? fn
//     : async function * (...args) {
//         const ret = await promisify(fn)(...args)
//
//         if (isPlainObject(ret)) {
//           yield await promisify(ret.beforeRender)()
//           yield await promisify(ret.afterRender)()
//           yield await promisify(ret.beforeDispose)()
//           yield await promisify(ret.afterDispose)()
//         } else {
//           yield ret
//         }
//       }
// }

function promisify(_fn: Function = noop) {
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
