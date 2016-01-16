'use strict'

const ko = require('knockout')

function decodeURLEncodedURIComponent(val) {
  if (typeof val !== 'string') { return val }
  return decodeURIComponent(val.replace(/\+/g, ' '))
}

function merge(dest, src, createAsObservable = true, prune = false) {
  if (!src) {
    return prune ? undefined : dest
  }

  const props = Object.keys(src)

  if (prune) {
    for (const prop in dest) {
      if (props.indexOf(prop) < 0) {
        props.push(prop)
      }
    }
  }

  for (const prop of props) {
    if (typeof dest[prop] === 'undefined')
      dest[prop] = createAsObservable ? fromJS(src[prop]) : src[prop]

    else if (ko.isWritableObservable(dest[prop]))
      dest[prop](src[prop])

    else if (typeof src[prop] === 'undefined')
      dest[prop] = undefined

    else if (src[prop].constructor === Object) {
      if (prune) {
        dest[prop] = {}
      }

      merge(dest[prop], src[prop], createAsObservable)
    }

    else
      dest[prop] = src[prop]
  }

  return dest
}

function deepEquals(foo, bar) {
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
  } else {
    return foo === bar
  }
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

module.exports = {
  decodeURLEncodedURIComponent,
  merge,
  deepEquals
}
