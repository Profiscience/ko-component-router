export function isArray(arr) {
  return typeof arr.splice === 'function'
}

export function runMiddleware(callbacks, ...args) {
  const downstream = []

  callbacks = callbacks.map((fn) => {
    if (fn.constructor.name === 'GeneratorFunction') {
      const runner = fn(...args)
      const _fn = () => runner.next().value || true // ensure returning false from middleware
      downstream.push(_fn)                          // won't short circuit the chain
      return _fn
    } else {
      return fn
    }
  })

  return [
    sequence(callbacks, ...args),
    () => sequence(downstream, ...args)
  ]
}

export async function sequence(callbacks, ...args) {
  for (const _fn of callbacks) {
    const fn = _fn.length === args.length + 1
      ? () => new Promise((r) => { _fn(...args, r) })
      : _fn

    let ret = fn(...args)

    if (typeof ret !== 'undefined' && typeof ret.then === 'function') {
      ret = await ret
    }

    if (ret === false) {
      return false
    }
  }
}
