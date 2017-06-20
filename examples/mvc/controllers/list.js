import User from '../models/user'

export * from '../views/list'

export function beforeRender(ctx) {
  ctx.users = User.fetchAll()
}
