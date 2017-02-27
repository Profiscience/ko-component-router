import Router from 'ko-component-router'

export default class UserEditorComponentViewModel {
  constructor({ user }) {
    this.user = user
  }

  save() {
    this.user.save()
    Router.update(`/${this.user.id}`)
  }
}
