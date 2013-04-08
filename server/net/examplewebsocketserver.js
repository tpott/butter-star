
var wss = require('ws').Server;
// Have server listen on port 8080
var server = new wss({ port:8080 });

// Create the server, once connection is established then execute the function
server.on('connection', function(socket) {
	console.log('Connection created!');
	
	// Once a message is received by the server, execute the function
	// Assumes that all transmitted data is JSON encoded
	socket.on('message', function(msg) {
		console.log('received: %s', msg);
		GLOBAL.obj = JSON.parse(msg);
		obj['data2'] = obj['data2'] + '1337';
		socket.send(JSON.stringify(obj));
	});
	
	socket.send(JSON.stringify('rohans mind is blown'));
});
