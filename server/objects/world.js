/**
 * @fileoverview Creates the representation of the world and the elements
 * that belong to it. Handles worldwide forces such as gravity.
 * @author Rohan Halliyal
 * @author Jennifer Fang
 */

// Get external functions
var THREE = require('three');

var ButterOBJLoader = require('./OBJLoader.js');
var Critter = require('./critter.js');
var Environment = require('./environment.js');
var Food = require('./food.js');
var randomPosition = require('./random.js').randomPosition;

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
  this.foods = {};

  /* @note We need these counters because the hashes don't have lengths */
	this.nplayers = 0;
	this.ncritters = 0;
  this.nfoods = 0;

  // Lists of IDs of objects that had state changes
  this.newCollidables = []; // all newly created collidables
  this.setCollidables = []; // all collidables that had state change
  this.delCollidables = []; // all deleted collidabls

  this.miscellaneous = []; // Currently holds broadcast messages to all players

  // needed for logic
  //  potential problem: used before set
  this.handler = null;

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

  this.handler.emit('newplayer');

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

  this.newCollidables.push(critter.id);
  return critter.id;
}

/**
 * Add a piece of food to the world.
 * @param {Food} food The new food to add to the world.
 * @return {string} The food ID.
 */
World.prototype.addFood = function(food) {
  this.collidables[food.id] = food;
  this.foods[food.id] = food;
  this.nfoods++;

  this.newCollidables.push(food.id);
  return food.id;
};

/**
 * Spawns a given number of critters at random, unoccupied locations.
 * @param {int} numCritters The number of critters to spawn.
 */
World.prototype.spawnCritters = function(numCritters) {
  for (var i = 0; i < numCritters; i++) {
    var critter = new Critter();

	 var position = randomPosition();

	 // while position is out of the environment or already occupied
	 while (! this.enviroContains(position) || this.occupied(position)) {
		 position = randomPosition();
	 }

	 critter.position.copy(position);
     critter.mesh.position.copy(position);

    this.addCritter(critter);
  }
};

World.prototype.enviroContains = function(pos) {
	return true;
}

World.prototype.occupied = function(pos) {
	return false;
}

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

    this.handler.emit('delplayer');

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

    this.handler.emit('delcritter');

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

World.prototype.attachHandler = function(handler) {
  this.handler = handler;
}

World.prototype.applyStates = function() {
	for (var id in this.players) {
		// uses the player state to create the force
		this.players[id].move();
        
        // uses the player state to get closest vacuum intersectec obj
        // TODO: extend to also affect players/food?
        var critters = this.players[id].doVacuum(this.critters);
        for (var cid in critters) {
            this.removeCritter(critters[cid]);
            this.players[id].incVacKills();
        }
	}
	for (var id in this.critters) {
		//this.critters[id].useAI();
        this.critters[id].move();
        this.setCollidables.push(id); // make sure updated critter is sent to client
	}
}

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

    if (this.players[id].moved) {
      this.setCollidables.push(id);
    }
	}

	for (var id in this.critters) {
		// add gravity
		this.critters[id].addGravity(); // each player has individual gravity

		// collision detection should happen in this call
		// apply forces ==> update velocity + update position
		this.critters[id].applyForces(this.collidables);

    if (this.critters[id].moved) {
      this.setCollidables.push(id);
    }
	}
}

module.exports = World;
