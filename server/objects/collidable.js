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

  this.gravity = new THREE.Vector4(0, -9.8, 0, 0);

  this.friction = 1.0; // in physics, this is usually "mu"
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

module.exports = Collidable;
