const http = require('http')
const path = require('path')
const { extend } = require('lodash')
const { red } = require('chalk')
const parser = require('tap-parser')
const connect = require('connect')
const socket = require('socket.io')
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

let cache, bundle, io, singleRun

module.exports = {
  * test(fly) {
    singleRun = true

    yield fly.serial(['test:build', 'test:serve'])
  },
  * 'test:watch'(fly) {
    singleRun = false

    yield fly.start('test:build')
    fly.start('test:serve')
    yield fly.watch([
      path.resolve(__dirname, '../test/**/*.ts'),
      path.resolve(__dirname, '../src/**/*.ts'),
    ], [
      'test:build'
    ])
  },
  * 'test:build'(fly) {
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
              nodeBuiltins(),
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
        .run({ every: false }, function * ([{ data: _bundle }]) {
          // store bundle in memory for server
          bundle = _bundle

          if (io) {
            io.emit('rebuild', { for: 'everyone' })
          }

          yield Promise.resolve()
        })
  },
  * 'test:serve'() {
    const app = connect()
    const server = http.Server(app)
    let resolve, parserStream

    if (singleRun) {
      parserStream = parser((results) => {
        if (singleRun) {
          resolve()
          process.exit(results.ok ? 0 : 1)
        }
      })
    }

    io = socket(server)

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(serveStatic(path.resolve(__dirname, '../test')))
    app.use('/bundle.js', (req, res) => {
      res.write(bundle, (err) => {
        if (err) {
          throw new Error(err)
        }
        res.end()
      })
    })

    io.on('connection', (ws) => {
      ws.on('tap', (message) => {
        process.stdout.write(message)
        parserStream.write(message)
      })

      ws.on('err', (message) => {
        if (singleRun) {
          throw new Error(message)
        } else {
          process.stdout.write(red('ERROR: ' + message))
        }
      })

      if (singleRun) {
        ws.on('end', () => {
          if (parserStream) {
            parserStream.end()
          }
        })
      }
    })

    server.listen(9876, () => {
      // eslint-disable-next-line
      console.log('Listening on %d', server.address().port)
    })

    opn('http://localhost:9876')

    yield new Promise((_resolve) => (resolve = _resolve))
  }
}
