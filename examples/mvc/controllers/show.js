import User from '../models/user'

export * from '../views/show'

export function beforeRender(ctx) {
  ctx.user = User.fetch(ctx.params.id)
}
