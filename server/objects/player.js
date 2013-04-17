/**
 * player.js
 *
 * An abstraction of a serverside player object.
 * @author Trevor Pottinger
 * @author Rohan Halliyal
 */

var randomID = require('./random.js');

function Player(socket, game) {
	this.socket = socket;
	this.game = game;
	this.id = randomID(16);

	console.log('New player: %d', this.id);
}

module.exports = Player;
