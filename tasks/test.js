const http = require('http')
const path = require('path')
const { extend } = require('lodash')
const connect = require('connect')
const WebSocket = require('ws')
const opn = require('opn')
const serveStatic = require('serve-static')
const bodyParser = require('body-parser')
const typescript = require('typescript')
const nodeResolve = require('rollup-plugin-node-resolve')
const nodeBuiltins = require('rollup-plugin-node-builtins')
const nodeGlobals = require('rollup-plugin-node-globals')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const istanbul = require('rollup-plugin-istanbul')
const { default: typescriptPlugin } = require('rollup-plugin-ts')
const { compilerOptions } = require('../tsconfig.json')

let cache

module.exports = function * (fly) {
  yield fly.source(path.resolve(__dirname, '../test/index.ts'))
    .rollup({
      rollup: {
        cache,
        plugins: [
          json(),
          commonjs({
            namedExports: {
              knockout: [
                'applyBindings',
                'applyBindingsToNode',
                'bindingHandlers',
                'components',
                'observable',
                'pureComputed',
                'tasks',
                'unwrap'
              ]
            }
          }),
          nodeGlobals(),
          nodeBuiltins({
            crypto: true
          }),
          typescriptPlugin({
            typescript,
            tsconfig: extend({}, compilerOptions, {
              target: 'es6',
              rootDir: './',
              baseUrl: './'
            })
          }),
          istanbul({
            include: [
              'src/**/*.js'
            ]
          }),
          nodeResolve({
            preferBuiltins: true
          })
        ]
      },
      bundle: {
        format: 'iife',
        sourceMap: 'inline'
      }
    })

    .run({ every: false }, function * ([file]) {
      const app = connect()
      let resolve

      app.use(bodyParser.urlencoded({ extended: false }))
      app.use(serveStatic(path.resolve(__dirname, '../test')))
      app.use('/bundle.js', (req, res) => {
        res.write(file.data, (err) => {
          res.end()
        })
      })
      app.use('/done', (req, res) => {
        resolve()
        res.end()
      })

      const server = http.createServer(app)

      const wss = new WebSocket.Server({ server })

      wss.on('connection', (ws) => {
        ws.on('message', (message) => {
          console.log('received: %s', message)
        })

        ws.send('something')
      })

      server.listen(9876, () => {
        console.log('Listening on %d', server.address().port)
      })

      // opn('http://localhost:9876')

      yield new Promise((_resolve) => (resolve = _resolve))
    })
    .target(path.resolve(__dirname, '../dist'))
}
