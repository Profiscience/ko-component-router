// loaded via script tag b/c rollup hates websockets
const io = window.io
const socket = io()

window.onerror = (err) => socket.emit('err', err)
