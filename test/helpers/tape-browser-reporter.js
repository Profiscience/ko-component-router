import tape from 'tape'
import $ from 'jquery'

const tap = tape.createStream()
const socket = io()

tap.on('data', (m) => {
  socket.emit('tap', m)
  $('#output').append(m.toString())
})

tap.on('end', (m) => {
  socket.emit('end', __coverage__)
})
