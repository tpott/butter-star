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

function Handler(world) {
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

module.exports = Handler;
