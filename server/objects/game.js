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

	setTimeout(gameTick(this), 1000 / TICKS);
}

// TODO link with game logic
Game.prototype.update = function() {
	// TODO ????
	// i think this is done asyncronously... 
}

Game.prototype.render = function() {
	// TODO push to clients!
}

Game.prototype.addPlayer = function(player) {
	this.players[player];
	return player.id;
}

Game.prototype.removePlayer = function(player) {
	return delete this.players[player.id];
}

// FUCK javascript
gameTick = function(game) {
	return function() {
		game.update();
		game.render(); // this gets sent to each of the clients
	}
}

module.exports = Game;
