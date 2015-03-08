require '../src/main'

componentSpecs = require './specs/component.spec'
stateSpecs = require './specs/state.spec'
routeSpecs = require './specs/router/route.spec'
html4Specs = require './specs/router/hashbang.spec'
html5Specs = require './specs/router/pushstate.spec'

blockRedirection = (e) -> e.preventDefault()

before ->
  window.addEventListener('beforeunload', blockRedirection)

after ->
  window.removeEventListener('beforeunload', blockRedirection)
  history.pushState(null, null, '/test')

describe 'state', stateSpecs
describe 'route', routeSpecs
describe 'component', componentSpecs

describe 'HTML4 (hashbang) Routing', ->
  describe 'default opts',       -> html4Specs()
  describe 'different basepath', -> html4Specs('/base')

describe 'HTML5 (pushstate) Routing', ->
  describe 'default opts',       -> html5Specs()
  describe 'different basepath', -> html5Specs('/base')