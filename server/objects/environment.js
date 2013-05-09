/**
 * server/objects/environment.js
 */

var THREE = require('three');
var util = require('util');

var Collidable = require('./collidable.js');
var Loader = require('./OBJLoader.js');

function Environment() {
  Environment.super_.call(this);

  this.geometry = Loader('../client/objects/blankRoom.obj');

  geometry.computeFaceNormals();
  geometry.computeCentroids();

}

util.inherits(Environment, Collidable);

module.exports = Environment;
