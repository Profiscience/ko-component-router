const socket = io()

socket.on('rebuild:started', (m) => {
  console.info('Rebuild started...') // eslint-disable-line
})

socket.on('rebuild:finished', (m) => {
  console.info('Rebuild finished... Reloading...') // eslint-disable-line
  window.location = 'http://localhost:9876' // eslint-disable-line
})
