/**
 * @fileoverview Serves up a simple web socket server that ties into
 * the game logic.
 * @author Trevor Pottinger
 */

// Get external functions.
var WebSocketServer = require('ws').Server;
var config = require('./../../config.js');

// TODO include game logic

var server = new WebSocketServer({port: config.wsPort}),
	 allConnections = [];

console.log('WebSockets listening on port %d.', config.wsPort);

/**
 * This is meant to handle any of the input from the client
 */
function isEvent(anything) {
	return false;
}

/**
 * Connects a given socket to an existing game
 */
function gameFor(socket) {
	function defaultGame() {
	}
	defaultGame.prototype.processEvent = function(event) {}
	return new defaultGame();
}

server.on('connection', function(socket) {
	console.log('New connection');
	var game = gameFor(socket);
	allConnections[allConnections.length] = socket;
	socket.on('message', function(anything) {
		if (isEvent(anything)) {
			game.processEvent(anything);
		}
		else {
			console.log('Received unknown input: %s', anything);
		}
	});
});

exports.wsServer = server;
