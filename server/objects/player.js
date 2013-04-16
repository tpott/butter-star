/**
 * An abstraction of a serverside player object.
 * @author Trevor Pottinger
 */

function Player(socket, game) {
	this.socket = socket;
	this.game = game;

	game.addPlayer(this);
	console.log('New player');
}

module.exports = Player;
