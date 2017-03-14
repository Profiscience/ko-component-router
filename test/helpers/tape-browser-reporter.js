import tape from 'tape'
import $ from 'jquery'

const tap = tape.createStream()
const socket = io()

tap.on('data', (m) => {
  socket.emit('tap', m)
  $('#output').append(m.toString())
})

tap.on('end', (m) => {
  history.pushState(null, null, '/')
  socket.emit('end', window.__coverage__ || {})
})
