import User from '../models/user'

export * from '../views/new'

export function beforeRender(ctx) {
  ctx.user = new User()
}
