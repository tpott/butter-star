/**
 * game.js
 *
 * @fileoverview This is supposed to represent a server-side game instance.
 * @author Trevor Pottinger
 */

var crypto = require('crypto');

var TICKS = 60; // 60 "ticks" per second!

function Game() {
	// generate a random url
	var sha = crypto.createHash('sha256'); // hash factory
	sha.update('' + Date.now(), 'utf8'); // feed the factory
	this.id = sha.digest('base64') // read and lock factory
		.slice(0,4)			// make shorter
		.replace(/\+/g, "-")	// replace non-url friendly characters
		.replace(/\//g, "_")
		.replace(/=/g, ",");

	this.world = null;
	this.players = [];
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
	return this.players.push(player);
}

// TODO this should be run per game
//setTimeout(gameTick, 1000 / ticksPerSec);

module.exports = Game;
