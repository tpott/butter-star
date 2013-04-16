/**
 * game.js
 *
 * @fileoverview This is supposed to represent a server-side game instance.
 * @author Trevor Pottinger
 */

var crypto = require('crypto');

var TICKS = 60; // 60 "ticks" per second!

function Game(httpServer) {
	// generate a random url
	var sha = crypto.createHash('sha256');
	sha.update('' + Date.now(), 'utf8');
	this['game-id'] = sha.digest('base64')
		.slice(0,10)			// make shorter
		.replace(/\+/g, "-")	// replace non-url friendly characters
		.replace(/\//g, "_")
		.replace(/=/g, ",");

	// this line is quite nifty
	httpServer.emit('newgame', this['game-id']);
}


// TODO link with game logic
Game.prototype.update = function() {}
Game.prototype.render = function() {}

Game.prototype.gameTick = function() {
	this.update();
	this.render(); // this gets sent to each of the clients
}

// TODO this should be run per game
//setTimeout(gameTick, 1000 / ticksPerSec);

module.exports = Game;
