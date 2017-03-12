const socket = io()

window.onerror = (err) => socket.emit('err', err)
