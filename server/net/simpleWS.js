/**
 * @fileoverview Serves up a simple web socket server that ties into
 * the game logic.
 * @author Trevor Pottinger
 */

// Get external functions.
var util = require('util');

var Player = require('./../objects/player.js');
var WebSocketServer = require('ws').Server;

// TODO include game logic

/**
 * @note [Server object].clients is an array that maintains an array of
 * all the currently open sockets
 */
function Server(config, httpServer) {
	Server.super_.call(this, {port: config.wsPort});

	this.httpServer = httpServer;

	this.on('listening', function() {
		console.log('WebSockets listening on port %d.', config.wsPort);
	});
	this.on('connection', this._newSocket);
	this.on('error', function(err) {
		console.log('ERROR: %s', err);
	});
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
	socket.player = player;
	game.addPlayer(player);

	console.log('New player: %s', player.id);

	// the socket must process client input
	socket.on('message', function(anything) {
		//console.log('Recevied input from %s', player.id);
		var obj = JSON.parse(anything);
		if (isEvent(obj)) {
			if(obj.moving)
			{
				player.move(obj);
			}
		}
		else {
			console.log('Received unknown input: %s', anything);
		}
	});

	socket.on('close', function() {
		console.log('Player leaving: %s', player.id);
		game.removePlayer(player);
	});
};

/**
 * This is meant to handle any of the input from the client
 */
function isEvent(anything) {
	return true;
}


module.exports = Server;
