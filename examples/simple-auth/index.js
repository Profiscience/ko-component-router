import ko from 'knockout'
import Router from 'ko-component-router'

Router.setConfig({
  base: '/simple-auth',
  hashbang: true
})

// globally registered auth middleware, runs for every route
Router.use((ctx) => {
  const isLoginPage = ctx.path === '/login'
  const isLoggedIn = sessionStorage.getItem('authenticated')

  if (!isLoggedIn && !isLoginPage) {
    ctx.redirect('//login')
  } else if (isLoggedIn && isLoginPage) {
    ctx.redirect('//')
  }
})

Router.useRoutes({
  '/': 'home',
  '/login': 'login',
  '/logout': (ctx) => {
    sessionStorage.removeItem('authenticated')
    ctx.redirect('/login')
  }
})

ko.components.register('home', {
  template: `
    <a data-bind="path: '/logout'">Logout</a>
  `
})

ko.components.register('login', {
  viewModel: class {
    login() {
      sessionStorage.setItem('authenticated', true)
      Router.update('/')
    }
  },
  template: `
    <h1>Login</h1>
    <button data-bind="click: login">Login</button>
  `
})

ko.applyBindings()
