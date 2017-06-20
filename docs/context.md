# Context

The context object contains information about the current route as well as any
data attached by [middleware](./middleware.md) (if applicable)

## API

#### ctx.router
Router that the current page belongs to

#### ctx.route
Current route

#### ctx.base
Parent pathname and app base, if applicable

#### ctx.path
The current path, excluding parent path, including child path

#### ctx.pathname
The current path, excluding parent path and child path

#### ctx.canonicalPath
The current path, including parent, excluding app base, excluding child path

#### ctx.params
Object containing route parameters

#### ctx.$root
Root context accessor

#### ctx.$parent
Parent context accessor

#### ctx.$parents
Array of parent contexts

#### ctx.$child
Child context accessor

#### ctx.$children
Array of child contexts

#### ctx.addBeforeNavigateCallback(([done]) => done(boolean|null) | Promise<boolean|null>)
Adds a function to be executed before the page is navigated away from, and potentially
block navigation. This may be used to show a save confirmation, for example.

Async is supported via promises or an optional `done` callback.

To prevent navigation, the beforeNavigate callback may
  a) return `false`
  b) return a Promise that resolves `false`
  c) return a rejected Promise
  d) call the optional `done` callback with `false`

Callbacks are executed LIFO; async functions will be ran in series. If a callback
prevents navigation by one of the above methods, no more callbacks will be executed.

e.x.

```javascript
import ko from 'knockout'
import swal from 'sweetalert2'

class ViewModel {
  constructor(ctx) {
    this.savePending = ko.observable(false)
    ctx.addBeforeNavigateCallback(this.promptToSave.bind(this))
  }

  // async functions are just functions that return promises behind the scenes
  async promptToSave() {
    if (!this.savePending()) {
      return false
    }

    try {
      await swal({
        title: 'Save Pending!',
        text: 'Are you sure you want to leave this page?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Discard Changes'
      })
    } catch (e) {
      return false
    }
  }
}
```

#### ctx.queue(promise)
Queues a promise and allows middleware to continue running, but still resolves
before the page is rendered. Allows for many async operations that do not depend
on each other to run concurrently. For an example, see the [lazy-loading](../examples/lazy-loading)
example and open the network tab. Each child loads its component via ajax, however
all of these requests are made at the same time and do not prevent other middleware
from executing.

#### ctx.redirect(path)
Only to be used in plain middleware, or the `beforeRender` of a lifecycle middleware,
this function short circuits the middleware execution, prevents an intermediate render
and runs and downstream lifecycle middleware to clean up, then navigates to a new route.

`path` is resolved via [utils.traversePath](./utils.md#traversePath)

---

[Back](./README.md)
