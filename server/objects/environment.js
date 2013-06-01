/**
 * server/objects/environment.js
 */

var THREE = require('three');
var util = require('util');

var Collidable = require('./collidable.js');
var Loader = require('./OBJLoader.js');

function Environment() {
  Environment.super_.call(this);

  this.scale = 1.0; // Not really...

  // load geometry obj
  /* NOTE(jyfang): DO NOT change to the actual model, collisions hella weird*/
  // TODO HOLY CRAP HELP WITH THIS
  this.mesh = Loader.parse('../client/models/blankRoom.obj');

  this.mesh.geometry.computeFaceNormals();
  this.mesh.geometry.computeCentroids();

  this.type = Collidable.types.ENVIRONMENT;

  /* NOTE(jyfang): Needed to make the room model on client side be in correct
     position.
   */
  this.position.setY(-4.93);
}

util.inherits(Environment, Collidable);

module.exports = Environment;
