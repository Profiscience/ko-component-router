import ko from 'knockout'

ko.components.loaders.unshift({
  loadComponent(name, config, done) {
    if (!config.template) {
      config.template = '<a></a>'
    }
    done(null)
  }
})
