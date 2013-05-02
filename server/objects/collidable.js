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
 * @param {wsWebSocket} socket The websocket to connect to.
 */
function Collidable(socket) {
  this.socket = socket;
  this.id = randomID(16);

  // TODO necessary? -Trevor
	this.position = new THREE.Vector4(0, 0, 0, 0);
	this.orientation = new THREE.Vector4(1, 0, 0, 0);
  // Client-side object this represents Will be set by subclasses.
  this.mesh = null;

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
  obj.camera = this.camera;
  return obj;
};

module.exports = Collidable;
