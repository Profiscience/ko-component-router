'use strict'

const ko = require('knockout')

function decodeURLEncodedURIComponent(val) {
  if (typeof val !== 'string') { return val }
  return decodeURIComponent(val.replace(/\+/g, ' '))
}

function merge(dest, src) {
  for (const prop in src) {
    if (typeof dest[prop] === 'undefined')
      dest[prop] = fromJS(src[prop])

    else if (ko.isWritableObservable(dest[prop]))
      dest[prop](src[prop])

    else if (src[prop].constructor === Object)
      merge(dest[prop], src[prop])

    else
      dest[prop] = src[prop]
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
  merge
}
