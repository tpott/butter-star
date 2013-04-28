/**
 * @fileoverview Object that should handle movement and collisions with
 * other objects.
 *
 * @author Jennifer Fang
 * @author Thinh Nguyen
 */

// Get external functions
var THREE = require('three');
var util = require('util');

var Collidable = require('./collidable.js');

/**
 * Creates a Movable object. Should not instantiate this class.
 * @constructor
 * @param {wsWebSocket} socket The websocket to connect to.
 * @param {Game} game The game this Movable belongs to.
 */
function Movable(socket, game) {
  Movable.super_.call(this, socket, game);

  // Dummy cube. Will be set by subclasses
  this.cube = null;
  /*this.vacTrans = new THREE.Vector3();
  this.initVacPos = null;
  // from Thinh
  this.position = {
		x : 0,
		y : 0,
		z : 0,
		direction : 0
	};
	this.camera = {
		speed : 300,
		distance : 5,
		x : 0,
		y : 0, 
		z : 0
	};*/

  this.velocity = new THREE.Vector4(0, 0, 0, 0);
  this.force = new THREE.Vector4(0, 0, 0, 0);
  this.mass = 1.0;
}
util.inherits(Movable, Collidable);

// TODO remove translate
/**
 * Move the object by the given deltas.
 * @param {float} dx Change in x direction (left/right).
 * @param {float} dy Change in y direction (vertical).
 * @param {float} dz Change in z direction (forward/back).
 */
Movable.prototype.translate = function(dx, dy, dz) {
  this.position.x += dx;
  this.position.y += dy;
  this.position.z += dz;
};

// TODO remove move
/**
 * Try to move the object in the given direction.
 * @param {float} dx Change in x direction (left/right).
 * @param {float} dy Change in y direction (vertical).
 * @param {float} dz Change in z direction (forward/back).
 */
Movable.prototype.move = function(dx, dy, dz) {
  // Do collision detection
  var raycaster = new THREE.Raycaster();
  raycaster.ray.direction.set(0,-1,0);
  raycaster.ray.origin.set(
      // TODO fix magic #2 that puts in center of cube
      this.position.x, this.position.y+2, this.position.z);

  var collidables = [];
  for (var id in this.game.collidables) {
    if(id != this.id)
      collidables.push(this.game.collidables[id]);
  }

  var intersections = raycaster.intersectObjects(collidables);
  if (intersections.length > 0) {
    // TODO idk what this is for :( why index 0?
    var distance = intersections[0].distance;

    if(distance > 0 && distance < 2) {
      this.translate(-1 * dx, -1 * dy, -1 * dz);
    } else { // not within object range, move normally
      this.translate(dx, dy, dz);
    }
  } else { // no intersections, can move normally
    this.translate(dx, dy, dz);
  }
  this.cube.matrixWorld.makeTranslation(
      this.position.x, this.position.y, this.position.z);
  this.game.addCollidable(this.id, this.cube);
};

/**
 * Apply the current force vector4 to the current position.
 * Collision detection should be applied here (not defined).
 */
Movable.prototype.applyForces = function() {
	// Force = mass * acceleration 
	var acceleration = this.force.multiplyScalar(1.0 / this.mass);

	// integration, then change velocity
	// TODO don't hardcode timelapse
	var timeLapse = 1000.0 / 60.0;
	this.velocity.add(acceleration.multiplyScalar(timeLapse));

	// TODO before or after changing velocity?
	this.position.add(this.velocity);

	// reset forces, because all of these have been applied
	this.force.set(0, 0, 0, 0);
};

/**
 * Add a force vector4 that can be applied at the end of this
 * game tick.
 * @param {THREE.Vector4} v the force to be added
 */
Movable.prototype.addForce = function(v) {
	this.force.add(v);
};

module.exports = Movable;
