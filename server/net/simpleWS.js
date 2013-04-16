/**
 * @fileoverview Serves up a simple web socket server that ties into
 * the game logic.
 * @author Trevor Pottinger
 */

// Get external functions.
var config = require('./../../config.js');
var Player = require('./../objects/player.js');
var WebSocketServer = require('ws').Server;
var util = require('util');

// TODO include game logic

function Server(httpServer) {
	Server.super_.call(this, {port: config.wsPort});

	this.allSockets = [];
	this.httpServer = httpServer;

	this.on('connection', this._newSocket);

	console.log('WebSockets listening on port %d.', config.wsPort);
}

// FUCK THIS LINE, it needs to be before method definitions
util.inherits(Server, WebSocketServer);

/**
 * Connects a given socket to an existing game
 */
Server.prototype.gameFor = function(socket) {
	// HACK return first game 
	for (var key in this.httpServer.games) {
		return this.httpServer.games[key];
	}
};

Server.prototype._newSocket = function(socket) {
	console.log('New connection');

	var game = this.gameFor(socket);
	var player = new Player(socket, game);

	// save this socket for all possible connections
	this.allSockets[this.allSockets.length] = socket;

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
