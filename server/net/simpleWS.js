/**
 * @fileoverview Serves up a simple web socket server that ties into
 * the game logic.
 * @author Trevor Pottinger
 */

// Get external functions.
var config = require('./../../config.js');
var WebSocketServer = require('ws').Server;

// TODO include game logic

var server = new WebSocketServer({port: config.wsPort}),
	 allConnections = [];

console.log('WebSockets listening on port %d.', config.wsPort);

/**
 * This is meant to handle any of the input from the client
 */
function isEvent(anything) {
}

server.on('connection', function(socket) {
	console.log('New connection');
	allConnections[allConnections.length] = socket;
	socket.on('message', function(anything) {
		if (isEvent(anything)) {
		}
	});
});

exports.wsServer = server;
