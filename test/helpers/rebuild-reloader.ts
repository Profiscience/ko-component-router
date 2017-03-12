// loaded via script tag b/c rollup hates websockets
const io = window.io

const socket = io()

socket.on('rebuild', (m) => {
  window.location = 'http://localhost:9876'
})
