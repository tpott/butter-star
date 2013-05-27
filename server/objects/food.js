/**
 * The server side food object.
 * @author Jennifer Fang
 */

// Get external functions
var THREE = require('three');
var util = require('util');

var Collidable = require('./collidable.js');
var Loader = require('./OBJLoader.js');

/**
 * Creates a Food object.
 * @constructor
 */
function Food() {
  Food.super_.call(this);

  // load geometry obj
  this.mesh = Loader.parse('../client/models/bunnyv2.obj'); // TODO FOOD

  this.mesh.geometry.computeFaceNormals();
  this.mesh.geometry.computeCentroids();

  this.radius = this.mesh.geometry.boundingSphere.radius;

  this.type = Collidable.types.FOOD;
}
util.inherits(Food, Collidable);

/**
 * Returns whether or not collidable has a bounding sphere.
 * @return {boolean} True because food has a bounding sphere.
 */
Food.prototype.hasBoundingSphere = function() {
  return true;
};

module.exports = Food;
