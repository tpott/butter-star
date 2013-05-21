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

	this.keyboardHandler = new Keyboard.Handler();

	// game logic
	this.status = "Not yet started";
	this.round = 0;

	var self = this;
	function serverTick() {
		setTimeout(serverTick, 1000 / self.ticks);
		self.gameTickBasedUpdate();
		self.sendUpdatesToAllClients();
	}
	setTimeout(serverTick, 1000 / self.ticks);
}

/**
 * Add a socket to this game.
 * @param {Socket} socket The new socket connecting to this game.
 * @return {string} The player ID.
 */
Game.prototype.addSocket = function(socket) {
  this.sockets[socket.id] = socket;
  this.world.addPlayer(socket.player); // Also adds player ID to new collidables

  var initObj = {
	  id : socket.id,
	  world : []
  };

	for (var id in this.world.collidables) {
		var colObj = {
			id : id,
			type : this.world.collidables[id].type, 
			model : 0, // default model for now
			position : this.world.collidables[id].position,
			orientation : this.world.collidables[id].orientation,
			state : this.world.collidables[id].state
		};
		initObj.world.push(colObj);
	}

	// the client receives this and inits stuff in client/object/worldstate.js

	var initMessage = JSON.stringify(initObj);
	this.sockets[socket.id].send(initMessage);

	return socket.id;
}

/**
 * Remove a socket from the game.
 * @param {Socket} socket The socket to remove from the game.
 * @return {boolean} True if successfully removes, false otherwise.
 */
Game.prototype.removeSocket = function(socket) {
  this.world.removePlayer(socket.player); // Also adds player ID to delete list

	if (delete this.sockets[socket.id]) {
		return true;
	} else {
		return false;
	}
}

/**
 * Parses the keypresses using the keyboard handler. If unable to 
 * parse the keypress, then it returns null. The return value of this
 * function eventually gets passed into eventBasedUpdate (below).
 * Both are called in server/net/simpleWS.js
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
	else if (evt.isMoveEvent()) {
		player.move(evt.name);
	}
	else if (evt.isToggleVacuum()) {
		player.toggleVacuum();
	}
	else if (evt.isRotateEvent()) { // mouse movement
		player.rotate(evt.data);
	}
	else {
		//console.log("Game '%s' unable to process event '%s'", this.id, evt);
	}
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

  var newCollidables = this.world.newCollidables;
	for (var i = 0; i < newCollidables.length; i++) {
		var id = newCollidables[i];
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

	// things that have been moved
  var setCollidables = this.world.setCollidables;
	for (var i = 0; i < setCollidables.length; i++) {
		var id = setCollidables[i];
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

  // things to get deleted
  var delCollidables = this.world.delCollidables;
	for (var i = 0; i < delCollidables.length; i++) {
		var id = delCollidables[i];
		var colObj = {
			id : id,
		};
		world.del.push(colObj);
	}

	// nothing deleted, so no point in sending deletions
	if (world.del.length == 0) {
		delete world.del;
		updates--;
	}

  // TODO ?? this is a list of IDs only lol
	world.misc = this.world.miscellaneous;
	
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
		if (newCollidables.indexOf(id) >= 0) {
			continue;
    }

		// TODO if socket is already closed and not removed yet
		this.sockets[id].send(updateMessage);
	}

	// reset since this is the end of a tick
  this.world.resetUpdateStateLists();
}



module.exports = Game;
