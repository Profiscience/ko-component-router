var io = window.io;
var socket = io();
window.onerror = function (err) { return socket.emit('err', err); };
//# sourceMappingURL=error-reporter.js.map