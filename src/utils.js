import _isPlainObject from 'is-plain-object'

export function isArray(arr) {
  return typeof arr.splice === 'function'
}

export function isFunction(x) {
  return typeof x === 'function'
}

export function isGenerator(x) {
  return x.constructor.name === 'GeneratorFunction'
}

export function isPlainObject(x) {
  return _isPlainObject(x)
}

export function isString(x) {
  return typeof x === 'string'
}

export function isUndefined(x) {
  return typeof x === 'undefined'
}

export function runMiddleware(callbacks, ...args) {
  const downstream = []

  callbacks = callbacks.map((_fn) => {
    const fn = isGenerator(_fn)
      ? _fn
      : generatorify(_fn)

    const runner = fn(...args)
    const run = async () => {
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
    () => sequence(downstream, ...args)
  ]
}

export async function sequence(callbacks, ...args) {
  for (const _fn of callbacks) {
    if (await promisify(_fn)(...args) === false) {
      return false
    }
  }
}

function generatorify(fn) {
  return async function * (...args) {
    const ret = await promisify(fn)(...args)

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

function isThenable(x) {
  return !isUndefined(x) && isFunction(x.then)
}

function promisify(_fn = () => {}) {
  return async (...args) => {
    const fn = () =>
      _fn.length === args.length + 1
        ? new Promise((r) => { _fn(...args, r) })
        : _fn(...args)

    const ret = fn()

    return isThenable(ret)
      ? await ret
      : ret
    }
}
