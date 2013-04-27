/**
 * @fileoverview Creates the representation of the world and the elements
 * that belong to it. Handles worldwide forces such as gravity.
 * @author Rohan Halliyal
 * @author Jennifer Fang
 */

// Get external functions
var THREE = require('three');

/**
 * Construct the game play world.
 * @constructor
 */
function World() {
  // List of all collidables. Includes all objects in below lists
  this.collidables = {};

  // Lists of objects that are in the world
  this.envrionmentObjs = {}; // TODO food should not be here later
	this.players = {};
  this.critters = {};

  /* @note We need these counters because the hashes don't have lengths */
	this.nplayers = 0;
	this.ncritters = 0;
  // TODO food, collidables, etc?

  // Make world environment
  this.floor = this.createFloor_();
}

/* ENVIRONMENT CREATION FUNCTIONS */

/**
 * Create the floor of the world.
 * @return {THREE.Mesh} The mesh representing the floor of the world.
 * @private
 */
World.prototype.createFloor_ = function() {
  var geometry = new THREE.PlaneGeometry(2000,2000,1,1);
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -10, 0));
  var material = new THREE.MeshBasicMaterial();
  return new THREE.Mesh(geometry, material);
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
 * Apply gravity to all the objects in the world.
 */
World.prototype.applyGravityToAllObjects = function() {
    /*for (var id in this.players) {
        this.applyGravity(this.players[id]);
    }

    for (var id in this.critters) {
        this.applyGravity(this.critters[id]);
    }*/

    // TODO apply to food
}

/**
 * Apply gravity to the given object.
 * @param {Collidable} obj Object to apply gravity to.
 */
World.prototype.applyGravity = function(obj) {
  // Create raycaster in direction gravity points
  var raycaster = new THREE.Raycaster();
  raycaster.ray.direction.set(0, -1, 0);
  raycaster.ray.origin.set(obj.position.x, obj.position.y, obj.position.z);

  // Check for collision against the ground
  var isOnGround = false;
  var intersections = raycaster.intersectObjects([this.floor]);
  if (intersections.length > 0) {
    var distance = intersections[0].distance;
    if(distance > 0 && distance <= 1) {
      isOnGround = true;
    }
  }

  // Handle movement in response to gravity
  if(isOnGround === true) {
    // TODO fix later for objs of diff heights
  } else {
    obj.translate_(0, -1, 0);
  }

  // Update mesh position for other objects to collide with
  obj.mesh.matrixWorld.makeTranslation(
    obj.position.x, 
    obj.position.y, 
    obj.position.z
  );
  this.collidables[obj.id] = obj.mesh;
};

module.exports = World;
