import tape from 'tape'

// loaded via script tag b/c rollup hates websockets
const io = window.io

const tap = tape.createStream()
const socket = io()

tap.on('data', (m) => {
  socket.emit('tap', m)
})

tap.on('end', (m) => {
  console.log('hit')
  socket.emit('end', m)
})
