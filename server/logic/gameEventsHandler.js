/**
 * server/logic/gameEventsHandler.js
 *
 * @fileoverview Handle large game events (player join, player leave, round start,
 * round end, etc..)
 * @author Trevor Pottinger
 */

var util = require('util'),
	 events = require('events');

var START_GAME_DELAY = 10 * 1000; // 10 seconds
var END_GAME_DELAY = 5 * 1000; // 5 seconds

function Handler(server, gameid, world) {
	// these two are needed for closing a game
	this.server = server;
	this.gameid = gameid;

	this.world = world;

	var self = this;
	this.on('newgame', function() {
		setTimeout(self.startRound(), START_GAME_DELAY);
	});

	this.on('newplayer', function() {
		self.message("Player joined");
	});

	this.on('delplayer', function() {
		self.message("Player left");

		if (self.world.nplayers == 0) {
			setTimeout(self.endGame(), END_GAME_DELAY);
		}
	});

}

util.inherits(Handler, events.EventEmitter);

/**
 * Returns a function that can start the round
 * FUCK JAVASCRIPT
 */
Handler.prototype.startRound = function() {
	var self = this;
	return function() {
		self.message("Round Starting");
	};
}

/**
 * Send a message to all the players
 */
Handler.prototype.message = function(str) {
	var message = { 'mess' : str };
	this.world.miscellaneous.push(message);
}

/**
 * Returns a function that will end the game
 */
Handler.prototype.endGame = function() {
	var self = this;
	return function() {
		// this check if the number of players is STILL zero, so
		//   if no one has rejoined...
		if (self.world.nplayers == 0) {
			self.server.removeGame(self.gameid);
		}
	};
}

module.exports = Handler;
