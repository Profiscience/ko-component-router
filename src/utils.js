import ko from 'knockout'

export function cascade(callbacks, ...args) {
  return new Promise((resolve) => {
    if (callbacks.length === 0) {
      return resolve(true)
    }
    const cb = callbacks.shift()
    const recursiveResolve = (shouldUpdate = true) => shouldUpdate
      ? cascade(callbacks, ...args).then(resolve)
      : resolve(false)

    if (cb.length === args.length + 1) {
      cb(...args, recursiveResolve)
    } else {
      const v = cb(...args)
      if (isUndefined(v) || typeof v.then !== 'function') {
        recursiveResolve(v)
      } else {
        v.then(recursiveResolve)
      }
    }
  })
}

export function clone(obj) {
  if (isArray(obj)) {
    return obj.slice(0)
  } else if (isPlainObject(obj)) {
    return extend({}, obj, false)
  } else {
    return obj
  }
}

export function decodeURLEncodedURIComponent(val) {
  if (typeof val !== 'string') { return val }
  return decodeURIComponent(val.replace(/\+/g, ' '))
}

export function deepEquals(foo, bar) {
  if (foo === null || bar === null) {
    return foo === null && bar === null
  }
  if (typeof foo !== typeof bar) {
    return false
  }
  if (isUndefined(foo)) {
    return isUndefined(bar)
  }
  if (isPrimitiveOrDate(foo) && isPrimitiveOrDate(bar)) {
    return foo === bar
  }

  if (foo.constructor === Object && bar.constructor === Object) {
    const fooProps = Object.keys(foo)
    const barProps = Object.keys(bar)
    if (fooProps.length !== barProps.length) {
      return false
    }
    for (const prop of fooProps) {
      if (!deepEquals(foo[prop], bar[prop])) {
        return false
      }
    }
    return true
  } else if (Array.isArray(foo) && Array.isArray(bar)) {
    if (foo.length !== bar.length) {
      return false
    }
    for (const el of foo) {
      if (bar.indexOf(el) < 0) {
        return false
      }
    }
    return true
  } else {
    return foo === bar
  }
}

export function extend(dest, src, createAsObservable = true, _shallow = true) {
  const props = Object.keys(src)

  for (const prop of props) {
    if (isUndefined(dest[prop])) {
      dest[prop] = createAsObservable ? fromJS(src[prop]) : src[prop]
    } else if (ko.isWritableObservable(dest[prop])) {
      if (!deepEquals(dest[prop](), src[prop])) {
        dest[prop](src[prop])
      }
    } else if (isUndefined(src[prop])) {
      dest[prop] = undefined
    } else if (isPlainObject(src[prop])) {
      if (_shallow) {
        dest[prop] = {}
      }
      extend(dest[prop], src[prop], createAsObservable)
    } else if (isArray(src[prop])) {
      dest[prop] = src[prop].slice(0)
    } else {
      dest[prop] = src[prop]
    }
  }

  return dest
}

export function identity(x) {
  return x
}

export function isUndefined(x) {
  return typeof x === 'undefined'
}

export function isFunction(x) {
  return typeof x === 'function'
}

export function isPlainObject(x) {
  return x.constructor === Object
}

export function isArray(x) {
  return isFunction(x.splice)
}

export function mapKeys(obj, fn) {
  const mappedObj = {}
  Object.keys(obj).forEach((k) => mappedObj[k] = fn(k))
  return mappedObj
}

export function merge(dest, src, createAsObservable = true) {
  extend(dest, src, createAsObservable, false)
}

function fromJS(obj, parentIsArray) {
  let obs

  if (isPrimitiveOrDate(obj))
    obs = parentIsArray ? obj : ko.observable(obj)

  else if (obj instanceof Array) {
    obs = []

    for (let i = 0; i < obj.length; i++)
      obs[i] = fromJS(obj[i], true)

    obs = ko.observableArray(obs)
  }

  else if (obj.constructor === Object) {
    obs = {}

    for (const p in obj)
      obs[p] = fromJS(obj[p])
  }

  return obs
}

function isPrimitiveOrDate(obj) {
  return obj === null ||
         obj === undefined ||
         obj.constructor === String ||
         obj.constructor === Number ||
         obj.constructor === Boolean ||
         obj instanceof Date
}
