var THREE = require('three');
var util = require('util');
var Loader = require('./OBJLoader.js');

function Battery() {
    this.name = "battery";
    this.position;
    this.mesh = Loader.parse('../client/models/battery.obj');
    this.mesh.geometry.computeFaceNormals();
}

module.exports = Battery;
