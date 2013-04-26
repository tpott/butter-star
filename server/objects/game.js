/**
 * game.js
 *
 * @fileoverview This is supposed to represent a server-side game instance.
 * @author Trevor Pottinger
 */

var randomID = require('./random.js');

function Game() {
	// generate a random url
	this.id = randomID(4);

	this.world = null;
	this.players = [];
	this.critters = [];
  this.collidables = [];
	this.nplayers = 0;
	this.ncritters = 0;
	this.ticks = 60; // 60 "ticks" per second!


	setTimeout(gameTick(this), 1000 / this.ticks);
}

// TODO link with game logic
Game.prototype.update = function() {
	//console.log('update');
	// create "worldstate"
	var allPlayers = [];
	for (var id in this.players) {
		var player = {};
		player.id = id;
		player.type = 'player';
		player.position = this.players[id].position;
		player.direction = this.players[id].direction;
		player.vacTrans = this.players[id].vacTrans;
		allPlayers.push(player);
	}
	for (var id in this.players) {
		// TODO HIGH
		// TODO if socket is already closed and not removed yet
		this.players[id].socket.send(JSON.stringify(allPlayers));
	}
}

Game.prototype.render = function() {
	// TODO push to clients!
}

/**
 * aPlayer is the player that has been updated
 */
Game.prototype.sendUpdateFrom = function(aPlayer) {
	var str = JSON.stringify(aPlayer.toObj());
	for (var id in this.players) {
		this.players[id].socket.send(str);
		//console.log(str);
	}
}

Game.prototype.addPlayer = function(player) {
	this.players[player.id] = player;
  this.collidables[player.id] = player.cube;
	this.nplayers++;
	return player.id;
}

Game.prototype.removePlayer = function(player) {
	var removedPlayer = {'remove': player.id};
	for (var id in this.players) {
		if (id == player.id) {
			continue;
		}
		this.players[id].socket.send(JSON.stringify(removedPlayer));
	}
  delete this.collidables[player.id];
	if (delete this.players[player.id]) {
		this.nplayers--;
		return true;
	}
	else {
		return false;
	}
}

Game.prototype.addCollidable = function(id, newObj) {
  this.collidables[id] = newObj;
};

// FUCK javascript
gameTick = function(game) {
	return function() {
		game.update();
		game.render(); // this gets sent to each of the clients
		setTimeout(gameTick(game), 1000 / game.ticks);
	}
}

module.exports = Game;