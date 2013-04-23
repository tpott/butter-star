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

  // Dummy dimensions and cube. Will be set by subclasses.
  this.width = 0; // x axis
  this.height = 0; // y axis
  this.depth = 0; // z axis
  this.cube = null;

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
 * Try to move the object in the given direction.
 * @param {float} dx Change in x direction (left/right).
 * @param {float} dy Change in y direction (vertical).
 * @param {float} dz Change in z direction (forward/back).
 */
Movable.prototype.move = function(dx, dy, dz) {
  // Get offsets to the vertical sides of cube
  var offsetSigns = [
      {x: 0.5, z: 0.5}, {x: -0.5, z: 0.5}, {x: 0.5, z: -0.5}, {x: -0.5, z: -0.5}
  ];

  // Make 4 rays for vertical sides of cube
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

  // Get other objects you can collide against
  var collidables = [];
  for (var id in this.game.collidables) {
    if(id != this.id)
      collidables.push(this.game.collidables[id]);
  }

  // Do collision detection
  var collided = false;
  for (var j = 0; j < raycasters.length; j++) {
    var raycaster = raycasters[j];
    var intersections = raycaster.intersectObjects(collidables);
    if (intersections.length > 0) {
      var distance = intersections[0].distance;

      if(distance > 0 && distance < 2) { // TODO
        collided = true;
      }
    }
  }

  if(collided === true) { // TODO
    this.translate(-1 * dx, -1 * dy, -1 * dz);
  } else {
    this.translate(dx, dy, dz);
  }
  this.cube.matrixWorld.makeTranslation(
      this.position.x, this.position.y, this.position.z);
  this.game.addCollidable(this.id, this.cube);
};

module.exports = Movable;
