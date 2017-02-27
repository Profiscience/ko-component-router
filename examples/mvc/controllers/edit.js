import User from '../models/user'

export * from '../views/edit'

export function beforeRender(ctx) {
  ctx.user = User.fetch(ctx.params.id)
}
