import ko from 'knockout'

export default function plugin(componentName) {
  return [
    // we return an array that the router understands, so first we'll
    // include the name of the component
    componentName,

    // then some middleware to load that component...
    () => {
      // bail if already loaded
      if (ko.components.isRegistered(componentName)) {
        return
      }

      // https://webpack.js.org/guides/code-splitting-import/
      return import('../views/' + componentName + '/index.js')
        .then((exports) => ko.components.register(componentName, exports))
        // eslint-disable-next-line no-console
        .catch((err) => console.error('Error fetching component', componentName, err))
    }
  ]
}
