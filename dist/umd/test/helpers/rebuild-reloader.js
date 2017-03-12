var io = window.io;
var socket = io();
socket.on('rebuild', function (m) {
    window.location = 'http://localhost:9876';
});
//# sourceMappingURL=rebuild-reloader.js.map