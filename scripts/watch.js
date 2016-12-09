#!/usr/bin/env node

'use strict' // eslint-disable-line

const path = require('path')
const chokidar = require('chokidar')

const compile = require('./lib/compile')

compile()

chokidar.watch(path.resolve(__dirname, '../src')).on('change', compile)
