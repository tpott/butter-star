/**
 * Server side representation of a critter.
 * @author Jennifer Fang
 */

// Get external functions
var THREE = require('three');
var util = require('util');

var Movable = require('./movable.js');
var Collidable = require('./collidable.js');
var Loader = require('./OBJLoader.js');

/**
 * Create an instance of a critter.
 * @constructor
 */
function Critter(){
    Critter.super_.call(this);

    this.type = Collidable.types.CRITTER;

    //load the critter mesh - TODO: don't hard code this path
    this.mesh = Loader.parse('../client/models/bunnyv2.obj');
    this.mesh.scale.set(0.01, 0.01, 0.01);
    //need to compute geometry face normals for raycaster intersections
    this.mesh.geometry.computeFaceNormals();
    this.radius = this.mesh.geometry.boundingSphere.radius; // for collisions
}
util.inherits(Critter, Movable);

module.exports = Critter;
