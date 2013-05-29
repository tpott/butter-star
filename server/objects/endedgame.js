/**
 * server/objects/endedgame.js
 *
 * Represents an ended game, keeps track of history, but none of the
 * worldstate info. It should record player stats.
 *
 * @author Trevor
 */

//var Game = require('./game.js');

function Player(player) {
	this.id = player.id;
	this.points = player.getVacKills();

	// TODO 
	this.display_name = player.id;
}

/**
 * Returns a string that represnts the time elapsed
 */
function elapsed(mill) {
	var seconds = Math.floor(mill / 1000);
	var minutes = Math.floor(seconds / 60);

	seconds = seconds % 60; // round off extra

	return minutes + " min, " + seconds + " secs";
}

function EndedGame(game) {
	this.id = game.id;

	this.players = {};

	for (var id in game.world.players) {
		this.players[id] = new Player(game.world.players);
	}

	// in milliseconds
	this.time_elapsed = Date.now() - game.start;
	this.time_elapsed_str = elapsed(this.time_elapsed);
}

module.exports = EndedGame;
