export default function plugin({
  beforeRender = noop,
  afterRender = noop,
  beforeDispose = noop,
  afterDispose = noop
}) {
  return (ctx) => ({
    beforeRender: beforeRender.bind(null, ctx),
    afterRender: afterRender.bind(null, ctx),
    beforeDispose: beforeDispose.bind(null, ctx),
    afterDispose: afterDispose.bind(null, ctx)
  })
}

function noop() { /* do nothing */ }
