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
 * @param {Game} game The game this Collidable belongs to.
 */
function Collidable(socket, game) {
  this.socket = socket;
  this.game = game;
  this.id = randomID(16);

	this.position = new THREE.Vector4(0, 0, 0, 0);
	this.orientation = new THREE.Vector4(1, 0, 0, 0);
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
