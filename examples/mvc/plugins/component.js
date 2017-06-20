import ko from 'knockout'

export default function plugin({ template, viewModel }) {
  if (template) {
    let componentName
    return (ctx) => ({
      beforeRender() {
        componentName = ctx.canonicalPath
        ctx.route.component = componentName
        ko.components.register(componentName, { template, viewModel, synchronous: true })
      },
      afterRender() {
        ko.components.unregister(componentName)
      }
    })
  }
}
