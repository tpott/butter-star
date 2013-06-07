var THREE = require('three');
var util = require('util');
var Loader = require('./OBJLoader.js');

function Butter() {
    this.name = "butter";
    this.position = new THREE.Vector3(0,0,0);
    this.mesh = Loader.parse('../client/models/butter.obj');
    this.mesh.scale.set(0.3,0.3,0.3);
    this.mesh.geometry.computeFaceNormals();
}

module.exports = Butter;
