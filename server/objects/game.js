/**
 * game.js
 *
 * @fileoverview This is supposed to represent a server-side game instance.
 * @author Trevor Pottinger
 */

var randomID = require('./random.js');

var TICKS = 60; // 60 "ticks" per second!

function Game() {
	// generate a random url
	this.id = randomID(4);

	this.world = null;
	this.players = {};
	this.critters = [];
}


// TODO link with game logic
Game.prototype.update = function() {}
Game.prototype.render = function() {}

Game.prototype.gameTick = function() {
	this.update();
	this.render(); // this gets sent to each of the clients
}

Game.prototype.addPlayer = function(player) {
	this.players[player];
	return player.id;
}

Game.prototype.removePlayer = function(player) {
	return delete this.players[player.id];
}

// TODO this should be run per game
//setTimeout(gameTick, 1000 / ticksPerSec);

module.exports = Game;
