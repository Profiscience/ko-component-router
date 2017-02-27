import ko from 'knockout'
import idGenerator from '../utils/id-generator'

const ids = idGenerator()

export default class User {
  constructor({
    id = ids.next().value,
    name,
    email,
    phoneNumber
  } = {}) {
    this.id = id
    this.name = ko.observable(name)
    this.email = ko.observable(email)
    this.phoneNumber = ko.observable(phoneNumber)
  }

  save() {
    localStorage.setItem(`users.${this.id}`, ko.toJSON(this))
  }

  destroy() {
    localStorage.removeItem(`users.${this.id}`)
  }

  static fetch(id) {
    return new User(JSON.parse(localStorage.getItem(`users.${id}`)))
  }

  static fetchAll() {
    return Object
      .keys(localStorage)
      .filter((k) => k.indexOf('users.') === 0)
      .map((k) => new User(JSON.parse(localStorage.getItem(k))))
  }
}
