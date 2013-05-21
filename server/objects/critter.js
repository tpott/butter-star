/**
 * server/objects/critter.js
 */

// Get external functions
var THREE = require('three');
var util = require('util');

var Movable = require('./movable.js');
var Collidable = require('./collidable.js');

function Critter(){
    Critter.super_.call(this);

	 this.type = Collidable.types.CRITTER;

    // TODO need radius, change center to rand loc
	 this.radius = 0.0;
}
util.inherits(Critter, Movable);

module.exports = Critter;
