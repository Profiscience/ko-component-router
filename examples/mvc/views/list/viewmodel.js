export default class UserListViewModel {
  constructor(ctx) {
    this.users = ctx.users
  }

  destroy(user) {
    user.destroy()
  }
}
