/**
 * server/objects/environment.js
 */

var THREE = require('three');
var util = require('util');

var Collidable = require('./collidable.js');
var Loader = require('./OBJLoader.js');

function Environment() {
  Environment.super_.call(this);

  this.scale = 1.0;

  // load geometry obj
  /* NOTE(jyfang): DO NOT change to roomWithWindows.obj, collisions hella weird*/
  this.mesh = Loader.parse('../client/models/blankRoom.obj');

  this.mesh.geometry.computeFaceNormals();
  this.mesh.geometry.computeCentroids();

  this.type = Collidable.types.ENVIRONMENT;
}

util.inherits(Environment, Collidable);

module.exports = Environment;
