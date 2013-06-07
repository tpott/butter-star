var THREE = require('three');
var util = require('util');
var Loader = require('./OBJLoader.js');

function Battery() {
    this.name = "battery";
    this.position = new THREE.Vector3(0,0,0);
    this.mesh = Loader.parse('../client/models/battery.obj');
    this.mesh.scale.set(0.3,0.3,0.3);
    this.mesh.geometry.computeFaceNormals();
}

module.exports = Battery;
