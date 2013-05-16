/**
 * @fileoverview Creates the representation of the world and the elements
 * that belong to it. Handles worldwide forces such as gravity.
 * @author Rohan Halliyal
 * @author Jennifer Fang
 */

// Get external functions
var THREE = require('three');

var ButterOBJLoader = require('./OBJLoader.js');
var Environment = require('./environment.js');
var Critter = require('./critter.js');

/**
 * Construct the game play world.
 * @constructor
 */
function World() {
  // List of all collidables. Includes all objects in below lists
  this.collidables = {};

  // Lists of objects that are in the world
  this.enviroObjs = {};
  this.players = {};
  this.critters = {};

  /* @note We need these counters because the hashes don't have lengths */
	this.nplayers = 0;
	this.ncritters = 0;

  // Make world environment
  this.createRoom_();
}

/* ENVIRONMENT CREATION FUNCTIONS */

World.prototype.createRoom_ = function() {
	var env = new Environment();

   this.collidables[env.id] = env;
   this.enviroObjs[env.id] = env;
};


/* ADD/REMOVE FUNCTIONS */

/**
 * Add a player to the world.
 * @param {Player} player The new player to add to the world.
 * @return {string} The player ID.
 */
World.prototype.addPlayer = function(player) {
  this.collidables[player.id] = player;
	this.players[player.id] = player;
	this.nplayers++;

	return player.id;
}

World.prototype.addCritter = function(numCritters) {
  for( var i = 0 ; i < numCritters; i++)
  {
    var critter = new Critter();
    critter.position = { x :  Math.floor(Math.random() * 20 - 10) * 20,
                               y :  Math.floor(Math.random() * 20) * 20 + 10,
                               z :  Math.floor(Math.random() * 20 - 10) * 20}
    critter.id = i;
    this.critters[i] = critter;
  }


}

/**
 * Remove a player from the world.
 * @param {Player} player The player to remove from the world.
 * @return {boolean} True if successfully removes, false otherwise.
 */
World.prototype.removePlayer = function(player) {
	var removedPlayer = {'remove': player.id};
	for (var id in this.players) {
		  if (id == player.id) {
			  continue;
		  }
      // TODO make event emitter to tell game to update the socket
		  this.players[id].socket.send(JSON.stringify(removedPlayer));
	}

  delete this.collidables[player.id];
	if (delete this.players[player.id]) {
		this.nplayers--;
		return true;
	} else {
		return false;
	}
}


/* WORLD MUTATOR FUNCTIONS */

/**
 * Apply forces to all objects that should be applied at the end of every game tick.
 */
World.prototype.applyForces = function() {
	for (var id in this.players) {
		// add gravity
		this.players[id].addGravity(); // each player has individual gravity

		// collision detection should happen in this call
		// apply forces ==> update velocity + update position
		this.players[id].applyForces(this.collidables);
	}
}

module.exports = World;
