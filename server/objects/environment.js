/**
 * server/objects/environment.js
 */

var THREE = require('three');
var util = require('util');

var Collidable = require('./collidable.js');
var Loader = require('./OBJLoader.js');

function Environment() {
  Environment.super_.call(this);

  // load geometry obj
  this.mesh = Loader.parse('../client/objects/blankRoom.obj');

  this.mesh.geometry.computeFaceNormals();
  this.mesh.geometry.computeCentroids();

  this.type = Collidable.types.ENVIRONMENT;
}

util.inherits(Environment, Collidable);

module.exports = Environment;
