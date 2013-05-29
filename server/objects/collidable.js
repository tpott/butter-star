/**
 * @fileoverview Object that should handle collisions with other objects.
 *
 * @author Jennifer Fang
 */

// Get external functions
var THREE = require('three');

var randomID = require('./../objects/random.js');

/**
 * Creates a Collidable object. Should not instantiate this class.
 * @constructor
 */
function Collidable() {
  this.id = randomID(16);

  // Client-side object this represents Will be set by subclasses.
  this.mesh = null;

  this.gravity = new THREE.Vector4(0, -0.0098, 0, 0);

  this.position = new THREE.Vector4(0, 0, 0, 1);
  this.orientation = new THREE.Vector4(0, 0, 1, 0);
  this.type = Collidable.types.COLLIDABLE;
  this.model = 0; // default model for each collidable

  this.friction = 0.09; // in physics, this is usually "mu"
};

// also set in client/objects/worldstate.js
Collidable.types = {
	COLLIDABLE : 0,
	MOVABLE : 1,
	PLAYER : 2,
	CRITTER : 3,
	ENVIRONMENT : 4,
	FOOD : 5
};

/**
 * Wrap the Collidable as an object.
 * @return {object}
 */
Collidable.prototype.toObj = function() {
  var obj = {};
  obj.id = this.id;
  obj.position = this.position;
  obj.orientation = this.orientation;
  return obj;
};

/**
 * Returns whether or not collidable has a bounding sphere. Default false.
 * @return {boolean} True if this collidable has a bounding sphere, false
 *     otherwise.
 */
Collidable.prototype.hasBoundingSphere = function () {
  return false;
}

module.exports = Collidable;
