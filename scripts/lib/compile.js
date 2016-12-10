'use strict' // eslint-disable-line

const fs = require('fs')
const path = require('path')
const spawn = require('cross-spawn')
const mkdirp = require('mkdirp')
const filesize = require('filesize')
const chalk = require('chalk')
const { rollup } = require('rollup')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

const src = path.resolve(__dirname, '../../src')
const dist = path.resolve(__dirname, '../../dist')
const modules = path.resolve(__dirname, '../../dist/modules')
const nodent = path.resolve(__dirname, '../../node_modules/nodent/nodent.js')
const buble = 'buble'

let cache

mkdirp.sync(modules)

function compile() {
  return new Promise((resolve, reject) => {
    const timer = process.hrtime()

    fs.readdir(src, (err, files) => {
      Promise.all(files.map((file) => new Promise((resolve) => {
        const nodentProc = spawn(nodent, ['--out', '--use=promises', '--noruntime', path.resolve(src, file)])
        const bubleProc = spawn(buble, ['-n', 'modules', '-y', 'dangerousForOf'])
        const out = fs.createWriteStream(path.resolve(dist, 'modules', file))

        nodentProc.stdout.pipe(bubleProc.stdin)
        bubleProc.stdout.pipe(out)

        nodentProc.stderr.on('data', (data) => {
          throw new Error('[nodent]', data.toString())
        })
        bubleProc.stderr.on('data', (data) => {
          throw new Error('[buble]', data.toString())
        })

        out.on('close', resolve)
      }))).then(() => {
        rollup({
          entry: path.resolve(modules, 'index.js'),
          external: 'knockout',
          cache,
          plugins: [
            nodeResolve({
              preferBuiltins: false
            }),
            commonjs()
          ]
        })
          .then((bundle) => {
            cache = bundle
            return bundle.write({
              dest: path.resolve(dist, 'ko-component-router.js'),
              format: 'umd',
              moduleId: 'ko-component-router',
              moduleName: 'ko.router',
              globals: {
                knockout: 'ko'
              },
            })
          })
          .then(() => {
            const raw = path.resolve(dist, 'ko-component-router.js')
            const min = path.resolve(dist, 'ko-component-router.min.js')

            spawn('uglifyjs', [raw, '-o', min])
              .on('close', () => {
                console.log(chalk.green('ko-component-router.js\t\t'), filesize(fs.statSync(raw).size)) // eslint-disable-line
                console.log(chalk.green('ko-component-router.min.js\t'), filesize(fs.statSync(min).size)) // eslint-disable-line
                console.log(chalk.gray('completed in'), toMicroseconds(process.hrtime(timer)), 'ms\n') // eslint-disable-line
                resolve()
              })
          })
          .catch((err) => {
            console.error(chalk.red(err)) // eslint-disable-line
            reject()
          })
      })
    })
  })
}


function toMicroseconds(t) {
  return Math.round((t[0] * 1000) + (t[1] / 1000000))
}

module.exports = compile
