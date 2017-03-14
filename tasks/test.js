const http = require('http')
const spawn = require('cross-spawn')
const path = require('path')
const { red } = require('chalk')
const parser = require('tap-parser')
const istanbul = require('istanbul')
const remap = require('remap-istanbul')
const connect = require('connect')
const socket = require('socket.io')
const opn = require('opn')
const serveStatic = require('serve-static')
const nodeResolve = require('rollup-plugin-node-resolve')
const nodeBuiltins = require('rollup-plugin-node-builtins')
const nodeGlobals = require('rollup-plugin-node-globals')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const rollupIstanbul = require('rollup-plugin-istanbul')

let cache, bundle, io, singleRun

module.exports = {
  * test(fly) {
    singleRun = true

    yield fly.serial(['modules', 'test:build', 'test:serve'])
  },
  * 'test:watch'(fly) {
    singleRun = false

    yield fly.start('test:build')

    fly.start('test:serve')

    yield fly.watch([
      path.resolve(__dirname, '../test/**/*.js'),
      path.resolve(__dirname, '../src/**/*.ts'),
    ], [
      'modules',  
      'test:build'
    ])
  },
  * 'test:build'(fly) {
    if (io) {
      io.emit('rebuild:started', { for: 'everyone' })
    }

    yield fly.source(path.resolve(__dirname, '../test/index.js'))
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
            rollupIstanbul({
              include: [
                'dist/**/*'
              ]
            }),
            nodeResolve({
              preferBuiltins: true
            })
          ]
        },
        bundle: {
          format: 'iife',
          sourceMap: true
        }
      })
      .run({ every: false }, function * ([{ data: _bundle }]) {
        // store bundle in memory for server
        bundle = _bundle

        if (io) {
          io.emit('rebuild:finished', { for: 'everyone' })
        }

        yield Promise.resolve()
      })
      .target(path.resolve(__dirname, '../dist'))
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
        if (parserStream) {
          parserStream.write(message)
        }
      })

      ws.on('err', (message) => {
        if (singleRun) {
          throw new Error(message)
        } else {
          process.stdout.write(red('ERROR: ' + message))
        }
      })

      ws.on('end', (coverage) => {
        const collector = new istanbul.Collector()
        const reporter = new istanbul.Reporter(null, path.resolve(__dirname, '../coverage'))
        const sync = false
      
        collector.add(coverage)
        reporter.add('json')
        reporter.write(collector, sync, () => {
          remap(path.resolve(__dirname, '../coverage/coverage-final.json'), {
            'html': path.resolve(__dirname, '../coverage/html'),
            'lcovonly': path.resolve(__dirname, '../coverage/lcov.info')
          }).then(() => {
            if (parserStream) {
              parserStream.end()
            }
          }).catch((err) => {
            throw new Error(err)
          })
        })
      })
    })

    server.listen(9876, () => {
      console.log('Listening on %d', server.address().port) // eslint-disable-line
      opn('http://localhost:9876').catch((err) => console.error(err)) // eslint-disable-line
    })

    yield new Promise((_resolve) => (resolve = _resolve))
  }
}
