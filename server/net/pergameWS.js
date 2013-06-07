/**
 * @fileoverview Serves up a simple web socket server that ties into
 * the game logic.
 * @author Trevor Pottinger
 */

// Get external functions.
var util = require('util');

var Player = require('./../objects/player.js');
var WebSocketServer = require('ws').Server;

/**
 * Create a Server instance.
 * @constructor
 * @param game is a game instance that is unique to this WS port
 * @note [Server object].clients is an array that maintains an array of
 * all the currently open sockets
 */
function Server(game, port) {
	Server.super_.call(this, {'port': port});

	this.game = game;
	this.port = port;

	var self = this;

	this.on('listening', function() {
		console.log('Game "%s" listening on port "%s"', 
			self.game.id, self.port);
	});
	this.on('connection', this._newSocket);
	this.on('error', function(err) {
		console.log('ERROR: %s', err);
	});
}
util.inherits(Server, WebSocketServer);

/**
 * Handle connecting a new socket to a game.
 * @param {Socket} socket The socket trying to connect.
 * @private
 */
Server.prototype._newSocket = function(socket) {
	// Create a player and connect to socket
	var player = new Player(socket);
	socket.player = player;
	socket.id = player.id;
	console.log('New player: %s', player.id);

	// Add new socket to a game. Also adds player to the game's world.
	this.game.addSocket(socket);

	var self = this;

	// Socket event handlers
	socket.on('message', function(anything) {
		var clientData = JSON.parse(anything);
		//var clientData = game.parseInput(player, anything);

		if (clientData instanceof Array) {
			self.game.eventBasedUpdate(player, clientData);
		} 
		else if (clientData.name) {
			// set name
			player.setName(clientData.name);
		} 
		else if (clientData.chatmessage) {
			//TODO is this.player the correct var to be using
			self.game.newChatMessage(this.player, clientData.chatmessage);
		}
		else {
			console.log("Bad data from client");
		}
	});

	socket.on('close', function() {
		console.log('Player leaving: %s', player.id);
		self.game.removeSocket(socket);
	});
};

module.exports = Server;
