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
 * @param config The server-side configurations.
 * @param httpServer The httpServer.
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
util.inherits(Server, WebSocketServer);

/**
 * Connects a given socket to an existing game.
 * @param {Socket} socket The socket to find a game for.
 */
Server.prototype.gameFor = function(socket) {
	// this gets set in client/net/connection using document.URL
	var url = socket.upgradeReq.url;
	var gameid = url.replace(/\//, '');

	if (gameid in this.httpServer.games) {
		return this.httpServer.games[gameid];
	}
	else {
		return null;
	}
};

/**
 * Handle connecting a new socket to a game.
 * @param {Socket} socket The socket trying to connect.
 * @private
 */
Server.prototype._newSocket = function(socket) {
	console.log('New connection');

	var game = this.gameFor(socket); // TODO

	if (game == null) {
		console.log('Game doesnt exist :(');
	}

  // Create a player and connect to socket
	var player = new Player(socket);
	socket.player = player;
  socket.id = player.id;
	console.log('New player: %s', player.id);

  // Add new socket to a game. Also adds player to the game's world.
	game.addSocket(socket);

	// Socket event handlers
	socket.on('message', function(anything) {
		var clientData = JSON.parse(anything);
		//var clientData = game.parseInput(player, anything);
		//console.log(clientData);

		if (clientData instanceof Array) {
			game.eventBasedUpdate(player, clientData);
		} else if (clientData.name) {
            // set name
            player.setName(clientData.name);
            console.log(clientData.name);
        }
		else {
			console.log("Bad data from client");
		}
	});

	socket.on('close', function() {
		console.log('Player leaving: %s', player.id);
		game.removeSocket(socket);
	});
};

module.exports = Server;
