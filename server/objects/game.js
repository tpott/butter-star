/**
 * game.js
 *
 * @fileoverview A server-side game instance. Handles the administrative
 * side of the game (i.e. updating the clients) and contains and instance
 * of the game play World.
 * @author Trevor Pottinger
 * @author Rohan Halliyal
 * @author Jennifer Fang
 */

// Get external functions
var THREE = require('three');

var randomID = require('./random.js');
var THREE = require('three');
var World = require('./world.js');
var Keyboard = require('../controls/handler.js');

/**
 * Construct a game instance.
 * @constructor
 */
function Game() {
	// generate a random url
	this.id = randomID(4);
	this.ticks = 60; // 60 "ticks" per second!

	this.sockets = {};
	this.world = new World();
	
	//setTimeout(gameTick(this), 1000 / this.ticks);
	//this.world.addCritter(10);

	this.newCollidables = [];
	this.setCollidables = [];
	this.delCollidables = [];
	this.miscellaneous = [];

	this.keyboardHandler = new Keyboard.Handler();

	var self = this;
	function serverTick() {
		setTimeout(serverTick, 1000 / self.ticks);
		self.gameTickBasedUpdate();
		self.sendUpdatesToAllClients();
	}
	setTimeout(serverTick, 1000 / self.ticks);
}


/**
 * Send an update of all object locations to all the clients
 */
// TODO link with game logic
/*Game.prototype.sendUpdate = function() {
	// create info about every players location and orientation
	var allPlayers = [];
	for (var id in this.players) {
		var player = {};
		player.id = id;
		player.type = 'player';
		player.position = this.players[id].position;
		//player.direction = this.players[id].direction;
		player.vacTrans = this.players[id].vacTrans;
		player.orientation = this.players[id].orientation;
		allPlayers.push(player);
	}
	
	// TODO spectators
	// send the data to each of the players + spectators
	for (var id in this.players) {
		// TODO HIGH HIGHER
		// TODO if socket is already closed and not removed yet
		this.players[id].socket.send(JSON.stringify(allPlayers));
	}
}*/

/**
 * Add a socket to this game.
 * @param {Socket} socket The new socket connecting to this game.
 * @return {string} The player ID.
 */
Game.prototype.addSocket = function(socket) {
  this.sockets[socket.id] = socket;
  this.world.addPlayer(socket.player);

  var world = [];

  // TODO send init message to socket
	for (var id in this.world.collidables) {
		var colObj = {
			id : id,
			type : this.world.collidables[id].type, 
			model : 0, // default model for now
			position : this.world.collidables[id].position,
			orientation : this.world.collidables[id].orientation,
			state : this.world.collidables[id].state
		};
		world.push(colObj);
	}
	//this.sockets[socket.id].send(JSON.stringify(world);


  this.newCollidables.push(socket.id);

	return socket.id;
}

/**
 * Remove a socket from the game.
 * @param {Socket} socket The socket to remove from the game.
 * @return {boolean} True if successfully removes, false otherwise.
 */
Game.prototype.removeSocket = function(socket) {
  this.world.removePlayer(socket.player);

  this.delCollidables.push(socket.id);

	if (delete this.sockets[socket.id]) {
		return true;
	} else {
		return false;
	}
}

/**
 * Parses the keypresses using the keyboard handler. If unable to 
 * parse the keypress, then it returns null.
 */
Game.prototype.parseInput = function(player, anything) {
	// obj should be a non-empty array
	var obj = JSON.parse(anything);
	if (obj instanceof Array) {
		return obj;
	}
	else {
		console.log("Bad input");
		return null;
	}
}

/**
 * Handles updating a given player for a given event.
 * @param {Array} clientData represents a key press
 */
Game.prototype.eventBasedUpdate = function(player, clientData) {
	var evt = this.keyboardHandler.parse(clientData);

	if (evt == null) {
		return;
	}
	else if (Keyboard.isMoveEvent(evt)) {
		player.move(evt);
	}
	else if (Keyboard['TOGGLE_VACCUM'] == Keyboard[evt]) {
		player.toggleVacuum();
	}
	else if (evt instanceof Array) { // mouse movement
		player.rotate(evt);
	}
	else {
		console.log("Game '%s' unable to process event '%s'", this.id, evt);
	}
	
/*Game.prototype.eventBasedUpdate = function(socket, anything) {
    var player = socket.player;

    var obj = JSON.parse(anything);
    if (isEvent(obj)) {
		 // TODO don't push if the id is already in the list
		 this.setCollidables.push(socket.id);
        player.direction = obj.angle;
		player.isVacuum = obj.isVacuum;
        player.vacAngleY = obj.vacAngleY;
        if(obj.moving) {
            player.move(obj, this.world.collidables);
        }
        player.updateVacuum(obj);
    }
    else {
        console.log('Received unknown input: %s', anything);
    }*/
}

/**
 * World changes that should happen every tick regardless of
 * client events (player inputs).
 */
Game.prototype.gameTickBasedUpdate = function() {
	this.world.applyForces(); 
}

/**
 * Send an update of the world state to all clients.
 */
Game.prototype.sendUpdatesToAllClients = function() {
	var updates = 4; // new, set, del, misc
	var world = {
		new : [],
		set : [],
		del : [],
		misc : []
	};

	// TODO clean this up... we already have a toObj() method with
	// some info. We could override it in the Player class.
	for (var i = 0; i < this.newCollidables.length; i++) {
		var id = this.newCollidables[i];
		var colObj = {
			id : id,
			type : this.world.collidables[id].type, 
			model : 0, // default model for now
			position : this.world.collidables[id].position,
			orientation : this.world.collidables[id].orientation,
			state : this.world.collidables[id].state
		};
		world.new.push(colObj);
	}

	// nothing new, so no point in sending it
	if (world.new.length == 0) {
		delete world.new;
		updates--;
	}

	for (var i = 0; i < this.setCollidables.length; i++) {
		var id = this.setCollidables[i];
		var colObj = {
			id : id,
			position : this.world.collidables[id].position,
			orientation : this.world.collidables[id].orientation,
			state : this.world.collidables[id].state
		};
		world.set.push(colObj);
	}

	// nothing moved, so no point in sending moves
	if (world.set.length == 0) {
		delete world.set;
		updates--;
	}

	for (var i = 0; i < this.delCollidables.length; i++) {
		var id = this.delCollidables[i];
		var colObj = {
			id : id,
		};
		world.set.push(colObj);
	}

	// nothing deleted, so no point in sending deletions
	if (world.del.length == 0) {
		delete world.del;
		updates--;
	}

	world.misc = this.miscellaneous;
	
	// nothing deleted, so no point in sending deletions
	if (world.misc.length == 0) {
		delete world.misc;
		updates--;
	}

	if (updates == 0) {
		// there is nothing new, moved, deleted, or miscellaneous
		return;
	}

	var updateMessage = JSON.stringify(world);
 
	// SEND THE WORLD INFO
	for (var id in this.sockets) {
		// new players dont need their first game tick
		if (this.newCollidables.indexOf(id) >= 0) 
			continue;

		// TODO if socket is already closed and not removed yet
		this.sockets[id].send(updateMessage);
	}

	// reset since this is the end of a tick
	this.newCollidables = [];
	this.setCollidables = [];
	this.delCollidables = [];
	this.miscellaneous = [];
}



module.exports = Game;
