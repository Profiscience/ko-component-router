import * as list from './controllers/list'
import * as _new from './controllers/new'
import * as show from './controllers/show'
import * as edit from './controllers/edit'

export default {
  '/': list,
  '/new': _new,
  '/:id': show,
  '/:id/edit': edit
}
