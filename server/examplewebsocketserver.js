

var wss = require('ws').Server;
var server = new wss({ port:8080 });
// hi
server.on('connection', function(socket) {
	console.log('Connection created!');
	socket.on('message', function(msg) {
		console.log('received: %s', msg);
		GLOBAL.obj = JSON.parse(msg);
		obj['data2'] = obj['data2'] + '1337';
		socket.send(JSON.stringify(obj));
	});
	socket.send(JSON.stringify('rohans mind is blown'));
});
