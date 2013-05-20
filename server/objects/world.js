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
  this.food = {};

  /* @note We need these counters because the hashes don't have lengths */
	this.nplayers = 0;
	this.ncritters = 0;
  this.nfood = 0;

  // Lists of IDs of objects that had state changes
  this.newCollidables = [];
  this.setCollidables = [];
  this.delCollidables = [];
  this.miscellaneous = [];

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

  this.newCollidables.push(player.id);
	return player.id;
}

/**
 * Add a critter to the world.
 * @param {Critter} critter The new critter to add to the world.
 * @return {string} The critter ID.
 */
World.prototype.addCritter = function(critter) {
  this.collidables[critter.id] = critter;
  this.critters[critter.id] = critter;
  this.ncritters++;

  this.newCollidables.push(critter.id); // TODO do we ever send the whole critter??
  return critter.id
}

/**
 * Spawns a given number of critters at random, unoccupied locations.
 * @param {int} numCritters The number of critters to spawn.
 */
World.prototype.spawnCritters = function(numCritters) {
  for (var i = 0; i < numCritters; i++) {
    var critter = new Critter();
    // TODO position needs to be somewhere that isnt occupied
    critter.position.set(
        Math.floor(Math.random() * 20 - 10) * 20,
        Math.floor(Math.random() * 20) * 20 + 10,
        Math.floor(Math.random() * 20 - 10) * 20,
        1);
    this.addCritter(critter);
  }
};

/**
 * Remove a player from the world.
 * @param {Player} player The player to remove from the world.
 * @return {boolean} True if successfully removes, false otherwise.
 */
World.prototype.removePlayer = function(player) {
  this.delCollidables.push(player.id);
  if (delete this.collidables[player.id] &&
	    delete this.players[player.id]) {
		this.nplayers--;
		return true;
	} else {
		return false;
	}
}

/**
 * Remove a critter from the world.
 * @param {Critter} critter The critter to remove from the world.
 * @return {boolean} True if successfully removes, false otherwise.
 */
World.prototype.removeCritter = function(critter) {
  this.delCollidables.push(critter.id);
  if (delete this.collidables[critter.id] &&
      delete this.critters[critter.id]) {
    this.ncritters--;
    return true;
  } else {
    return false;
  }
};

/**
 * Reset the update state lists.
 */
World.prototype.resetUpdateStateLists = function() {
  this.newCollidables = [];
  this.setCollidables = [];
  this.delCollidables = [];
  this.miscellaneous = [];
};


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
		var moved = this.players[id].applyForces(this.collidables);

    if (moved === true) {
      this.setCollidables.push(id);
    }
	}

  // TODO critters
  // TODO food
}

module.exports = World;
