// Get external functions
var THREE = require('three');
var util = require('util');

var Movable = require('./movable.js');

function Critter(){
    Critter.super_.call(this);

    // TODO need radius, change center to rand loc
}
util.inherits(Critter, Movable);

module.exports = Critter;
