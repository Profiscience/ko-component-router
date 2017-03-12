import tape from 'tape'

const tap = tape.createStream()
const socket = io()

tap.on('data', (m) => {
  socket.emit('tap', m)
})

tap.on('end', (m) => {
  socket.emit('end', __coverage__)
})
