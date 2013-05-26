/**
 * The server side food object.
 * @author Jennifer Fang
 */

var THREE = require('three');
var util = require('util');

var Collidable = require('./collidable.js');
var Loader = require('./OBJLoader.js');

function Food() {
  Food.super_.call(this);

  // load geometry obj
  /* TODO uncomment when the food file is loaded
  this.mesh = Loader.parse('../client/objects/blankRoom.obj');

  this.mesh.geometry.computeFaceNormals();
  this.mesh.geometry.computeCentroids();
  */

  this.type = Collidable.types.FOOD;
}
util.inherits(Food, Collidable);

module.exports = Food;
