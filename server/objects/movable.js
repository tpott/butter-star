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
 */
function Movable() {
  Movable.super_.call(this);

  // Dummy dimensions and mesh. Will be set by subclasses
  this.width = 0; // x axis
  this.height = 0; // y axis
  this.depth = 0; // z axis
  this.mesh = null;

  this.position = new THREE.Vector4(0, 0, 0, 0);
  this.orientation = new THREE.Vector4(1, 0, 0, 0);

  this.velocity = new THREE.Vector4(0, 0, 0, 0);
  this.force = new THREE.Vector4(0, 0, 0, 0);
  this.mass = 1.0;
};
util.inherits(Movable, Collidable);

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

/**
 * Try check if the object will collide with another object
 * when it moves by the given deltas.
 * @return {Collidable} Object collided with. Null if no object.
 * @private
 */
Movable.prototype.checkCollision_ = function(collidables) {
  // Get offsets to the vertical sides of cube mesh from center of cube
  var offsetSigns = [
    {x: 0.5, z: 0.5},
    {x: -0.5, z: 0.5},
    {x: 0.5, z: -0.5},
    {x: -0.5, z: -0.5}
  ];

  // make 4 rays for vertical sides. Will check if rays intersect other objects
  var raycasters = [];
  for (var i = 0; i < 4; i++) {
    var raycaster = new THREE.Raycaster();
    raycaster.ray.direction.set(0, -1, 0); // TODO something with this.velocity
    raycaster.ray.origin.set(
        this.position.x + (offsetSigns[i].x * this.width),
        this.position.y + this.height, // set origin to top of cube
        this.position.z + (offsetSigns[i].z * this.depth)
    );
    raycasters.push(raycaster);
  }

  // Get a list of meshes this object can collide against
  var meshes = [];
  for (var id in collidables) {
    if(id != this.id) {
      meshes.push(collidables[id].mesh);
    }
  }

  // Do collision detection. Intersect each ray with each mesh.
  // TODO error: overlap with multiple objects?
  var collidable = null; // The object it collided with
  for (var j = 0; j < raycasters.length; j++) {
    var raycaster = raycasters[j];
    var intersections = raycaster.intersectObjects(meshes);
    if (intersections.length > 0) {
      // get distance overlapped with closest object
      var distance = intersections[0].distance;

      if(distance > 0 && distance < 2) { //TODO
        collidable = intersections[0].object;
        collidable.vector = new THREE.Vector4(0, 0, 0, 0); // TODO
      }
    }
  }

  return collidable;
};

/**
 * Apply the current force vector4 to the current position.
 * Collision detection should be applied here (not defined).
 * @param {Array.<Collidable>} collidables List of collidables.
 */
Movable.prototype.applyForces = function(collidables) {
	// Force = mass * acceleration 
	var acceleration = this.force.multiplyScalar(1.0 / this.mass);

	// integration, then change velocity
	// TODO don't hardcode timelapse
	var timeLapse = 1000.0 / 60.0;
	this.velocity.add(acceleration.multiplyScalar(timeLapse));

	// TODO collisions!
	var collision = this.checkCollision_(collidables);

	if (collision != null) {
		var mu = collision.friction;
		this.force.copy(mu * this.velocity.clone().multiplyScalar(-1.0));

		// TODO vector := the vector you CAN move... 
		this.position.add(collision.vector);
	}
	else {
		// TODO before or after changing velocity?
		this.position.add(this.velocity);

		// reset forces, because all of these have been applied
		this.force.set(0, 0, 0, 0);
	}

  // Update the mesh's position so other objects can collide with it
  this.mesh.matrixWorld.makeTranslation(
      this.position.x, this.position.y, this.position.z);
  collidables[this.id] = this.mesh;
};

/**
 * Add a force vector4 that can be applied at the end of this
 * game tick.
 * @param {THREE.Vector4} v the force to be added
 */
Movable.prototype.addForce = function(v) {
	this.force.add(v);
};

/**
 * Add gravity force to the net force.
 */
Movable.prototype.addGravity = function() {
  this.force.add(this.gravity);
};

module.exports = Movable;
