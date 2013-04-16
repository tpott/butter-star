/**
 * @fileoverview Serves up a simple web socket server that ties into
 * the game logic.
 * @author Trevor Pottinger
 */

// Get external functions.
var config = require('./../../config.js');
var WebSocketServer = require('ws').Server;
var util = require('util');

// TODO include game logic

function Server() {
	this.allConnections = [];
	Server.super_.call(this, {port: config.wsPort});

	// necessary according to http://tinyurl.com/c4g8hpt
	/*var javascriptIsStupid = function(obj) {
		return function(socket) {
			obj._newSocket(socket);
		};
	};*/

	this.on('connection', this._newSocket);

	console.log('WebSockets listening on port %d.', config.wsPort);
}

// FUCK THIS LINE, it needs to be before method definitions
util.inherits(Server, WebSocketServer);

/**
 * Connects a given socket to an existing game
 */
Server.prototype.gameFor = function(socket) {
	function defaultGame() {
	}
	defaultGame.prototype.processEvent = function(event) {}
	return new defaultGame();
};

Server.prototype._newSocket = function(socket) {
	console.log('New connection');

	var game = this.gameFor(socket);

	// save this socket for all possible connections
	this.allConnections[this.allConnections.length] = socket;

	// the socket must process client input
	socket.on('message', function(anything) {
		if (isEvent(anything)) {
			game.processEvent(anything);
		}
		else {
			console.log('Received unknown input: %s', anything);
		}
	});
};

/**
 * This is meant to handle any of the input from the client
 */
function isEvent(anything) {
	return false;
}


module.exports = Server;
