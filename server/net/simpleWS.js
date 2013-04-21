/**
 * @fileoverview Serves up a simple web socket server that ties into
 * the game logic.
 * @author Trevor Pottinger
 */

// Get external functions.
var util = require('util');

var config = require('./../../config.js');
var Collidable = require('./../physics/collide.js');
var Player = require('./../objects/player.js');
var WebSocketServer = require('ws').Server;

// TODO include game logic

function Server(httpServer) {
	Server.super_.call(this, {port: config.wsPort});

	this.allSockets = [];
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
  var collidable = new Collidable(socket, game);
  game.addPlayer(collidable);

	// TODO should we remove these once the socket is closed?
	// save this socket for all possible connections
	this.allSockets.push(socket);

	// the socket must process client input
	socket.on('message', function(anything) {
		//console.log('Recevied input from %s', player.id);
		var obj = JSON.parse(anything);
		if (isEvent(obj)) {
      collidable.move(obj);
		}
		else {
			console.log('Received unknown input: %s', anything);
		}
	});

	socket.on('close', function() {
		console.log('Player left the game');
    game.removePlayer(collidable)
	});
};

/**
 * This is meant to handle any of the input from the client
 */
function isEvent(anything) {
	return true;
}


module.exports = Server;
