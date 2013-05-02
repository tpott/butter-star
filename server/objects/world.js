/**
 * @fileoverview Creates the representation of the world and the elements
 * that belong to it. Handles worldwide forces such as gravity.
 * @author Rohan Halliyal
 * @author Jennifer Fang
 */

// Get external functions
var THREE = require('three');

var OBJMTLLoader = require('../libs/OBJMTLLoader.js');

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
  //this.createRoom_();
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

World.prototype.createRoom_ = function() {
  var loader = new OBJMTLLoader();
  loader.addEventListener( 'load', function ( event ) {
    var object = event.content;
    var tempScale = new THREE.Matrix4();
    object.position.y = -5;
    object.position.x = -20;
    //object.scale.set(.1,.1,.1);

    var objMesh = object.children[0];
    // Set position to same as object. MUST do otherwise collisions off.
    objMesh.position.y = -5;
    objMesh.position.x = -20;

    this.collidables['room'] = obj;
    this.enviroObjs['room'] = obj;
  });
	loader.load( 'roomWithWindows.obj', 'roomWithWindows.mtl' );
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
 * Apply forces to all objects that should be applied at the end of every game tick.
 */
World.prototype.applyForces = function() {
	for (var id in this.players) {
		// add gravity
		// this.players[id].addGravity(); // each player has individual gravity

		// collision detection should happen in this call
		// apply forces ==> update velocity + update position
		this.players[id].applyForces(this.collidables);                                           
	}
}

module.exports = World;
