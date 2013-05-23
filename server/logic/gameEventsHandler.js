/**
 * server/logic/gameEventsHandler.js
 *
 * @fileoverview Handle large game events (player join, player leave, round start,
 * round end, etc..)
 * @author Trevor Pottinger
 */

var util = require('util'),
	 events = require('events');

var START_GAME_DELAY = 5 * 1000; // 5 seconds
var END_GAME_DELAY = 5 * 1000; // 5 seconds
var END_ROUND_DELAY = 5 * 1000; // 5 seconds

var CRIT_MULT = 5;

function Handler(server, gameid, world) {
	// these two are needed for closing a game
	this.server = server;
	this.gameid = gameid;

	this.world = world;
  this.world.attachHandler(this);

  this.round = 0;

  // used in client gamelist
  this.status = "Not yet started";

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

  this.on('delcritter', function() {
    if (self.world.ncritters == 0) {
      setTimeout(self.endRound(), END_ROUND_DELAY);
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
    self.round++;

		self.message("Round " + self.round + " Starting");

    self.status = "Round " + self.round;

    self.world.spawnCritters( CRIT_MULT * self.round );
	};
}

/**
 * Send a message to all the players
 */
Handler.prototype.message = function(str) {
	var message = { 'mess' : str };
	this.world.miscellaneous.push(message);
  console.log(this.world.miscellaneous);
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

/**
 * Returns a function that will end the round
 */
Handler.prototype.endRound = function() {
	var self = this;
	return function() {
    self.startRound()();
	};
}


module.exports = Handler;
