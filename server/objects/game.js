/**
 * game.js
 *
 * @fileoverview This is supposed to represent a server-side game instance.
 * @author Trevor Pottinger
 */

// Get external functions
var THREE = require('three');

var randomID = require('./random.js');
var World = require('./world.js');

function Game() {
	// generate a random url
	this.id = randomID(4);

	this.players = [];
    this.collidables = [];
	this.world = new World(this.players, this.collidables);
    this.critters = [];
	this.nplayers = 0;
	this.ncritters = 0;
	this.ticks = 60; // 60 "ticks" per second!

	setTimeout(gameTick(this), 1000 / this.ticks);
}


// TODO link with game logic
Game.prototype.sendUpdatesToAllClients = function() {
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
    //console.log("here " + something[player.id);
	this.nplayers++;
	this.sendUpdateFrom(player);

    // might want a better way to sync players between game and world
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

// TODO
function isEvent(anything) {
  return true;
}; 

Game.prototype.eventBasedUpdate = function (anything, player) {
    //console.log('Recevied input from %s', player.id);
    var obj = JSON.parse(anything);
    if (isEvent(obj)) {
        if(obj.moving)
        {
            player.move(obj, this.collidables);
        }
        player.updateVacuum(obj);
    }
    else {
        console.log('Received unknown input: %s', anything);
    }
}

Game.prototype.gameTickBasedUpdate = function() {
    this.world.applyGravityToAllObjects();
}

// FUCK javascript
gameTick = function(game) {
	return function() {
        game.gameTickBasedUpdate();
		game.sendUpdatesToAllClients();
		game.render(); // this gets sent to each of the clients
		setTimeout(gameTick(game), 1000 / game.ticks);
	}
}

module.exports = Game;
