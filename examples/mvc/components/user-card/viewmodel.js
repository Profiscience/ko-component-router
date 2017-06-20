import { Router } from 'ko-component-router'

export default class UserCardComponentViewModel {
  constructor({ user }) {
    this.user = user
  }

  destroy() {
    this.user.destroy()
    Router.update('/', { force: true })
  }
}
