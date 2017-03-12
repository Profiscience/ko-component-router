const socket = io()

socket.on('rebuild', (m) => {
  window.location = 'http://localhost:9876' // eslint-disable-line
})
