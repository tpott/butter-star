var THREE = require('three');
var util = require('util');
var Loader = require('./OBJLoader.js');

function Soap() {
    this.name = "soap";
    this.position;
    this.mesh = Loader.parse('../client/models/soap.obj');
    this.mesh.scale.set(0.07,0.07,0.07);
    this.mesh.geometry.computeFaceNormals();
}

module.exports = Soap;
