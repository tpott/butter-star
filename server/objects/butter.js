var THREE = require('three');
var util = require('util');
var Loader = require('./OBJLoader.js');

function Butter() {
    this.name = "butter";
    this.position;
    this.mesh = Loader.parse('../client/models/butter.obj');
    this.mesh.scale.set(0.07,0.07,0.07);
    this.mesh.geometry.computeFaceNormals();
}

module.exports = Butter;
