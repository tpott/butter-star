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
 */
function Movable(socket) {
  Movable.super_.call(this, socket);

  // Dummy dimensions and mesh. Will be set by subclasses.
  this.width = 0; // x axis
  this.height = 0; // y axis
  this.depth = 0; // z axis
  this.mesh = null;

  // TODO move to player... Moveables include bunnies
  this.vacTrans = new THREE.Vector3();
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
	};
}
util.inherits(Movable, Collidable);

/**
 * Move the object position by the given deltas. Helper method used by move().
 * @param {float} dx Change in x direction (left/right).
 * @param {float} dy Change in y direction (vertical).
 * @param {float} dz Change in z direction (forward/back).
 * @private
 */
Movable.prototype.translate_ = function(dx, dy, dz) {
  this.position.x += dx;
  this.position.y += dy;
  this.position.z += dz;
};

/**
 * Change the object position to be the new x, y, z.
 * @param {float} x The new x position.
 * @param {float} y The new y position.
 * @param {float} z The new z position.
 * @private
 */
Movable.prototype.moveTo_ = function(x, y, z) {
  this.position.x = x;
  this.position.y = y;
  this.position.z = z;
};

/**
 * Try check if the object will collide with another object
 * when it moves by the given deltas.
 * @param {float} dx Change in x direction (left/right).
 * @param {float} dy Change in y direction (vertical).
 * @param {float} dz Change in z direction (forward/back).
 * @return {boolean} True if collision will occur, false otherwise
 * @private
 */
Movable.prototype.checkCollision_ = function(dx, dy, dz, collidables) {
  // Get offsets to the vertical sides of cube mesh from center of cube
  var offsetSigns = [
      {x: 0.5, z: 0.5},
      {x: -0.5, z: 0.5},
      {x: 0.5, z: -0.5},
      {x: -0.5, z: -0.5}
  ];

  // Make 4 rays for vertical sides. Will check if rays interset other objects.
  var raycasters = [];
  for (var i = 0; i < 4; i++) {
    var raycaster = new THREE.Raycaster();
    raycaster.ray.direction.set(0,-1,0);
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
      meshes.push(collidables[id].getMesh());
    }
  }

  // Do collision detection. Interset each ray with each mesh.
  var collided = false;
  for (var j = 0; j < raycasters.length; j++) {
    var raycaster = raycasters[j];
    var intersections = raycaster.intersectObjects(meshes);
    if (intersections.length > 0) {
      // get distance overlapped with closest object
      // TODO overlap with multiple objects?
      var distance = intersections[0].distance;

      if(distance > 0 && distance < 2) { // TODO
        collided = true;
      }
    }
  }

  return collided;
};

/**
 * Try to move by the given deltas.
 * @param {float} dx Change in x direction (left/right).
 * @param {float} dy Change in y direction (vertical).
 * @param {float} dz Change in z direction (forward/back).
 */
// TODO make so move doesn't need to get passed collidables
// boolean to check for updated collidables list from game?
Movable.prototype.move = function(dx, dy, dz, collidables) {
  var collided = this.checkCollision_(dx, dy, dz, collidables);

  // Handle collision movement, otherwise move normally
  if(collided === true) {
    this.translate_(-1 * dx, -1 * dy, -1 * dz); // TODO
  } else {
    this.translate_(dx, dy, dz);
  }

  // Update the mesh's position so other objects can collide with it
  this.mesh.matrixWorld.makeTranslation(
      this.position.x, this.position.y, this.position.z);
  collidables[this.id] = this.mesh;
};

module.exports = Movable;
