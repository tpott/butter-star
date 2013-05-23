/**
 * server/objects/critter.js
 */

// Get external functions
var THREE = require('three');
var util = require('util');

var Movable = require('./movable.js');
var Collidable = require('./collidable.js');
var Loader = require('./OBJLoader.js');

function Critter(){
    Critter.super_.call(this);

    this.type = Collidable.types.CRITTER;

    // TODO need radius, change center to rand loc
    this.radius = 0.0;

    //load the critter mesh - TODO: don't hard code this path
    this.mesh = Loader.parse('../client/objects/ghost/boo.obj');
    //need to compute geometry face normals for raycaster intersections
    this.mesh.geometry.computeFaceNormals();
}
util.inherits(Critter, Movable);

module.exports = Critter;
