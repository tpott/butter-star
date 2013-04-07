

var ws = require('ws').Server;
var server = new ws({ port:8080 });

server.on('connection', function(socket) {
	console.log('Connection created!');
	socket.send('rohans mind is blown');
});
