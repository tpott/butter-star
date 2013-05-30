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

    this.scale = 0.12;

    this.type = Collidable.types.CRITTER;

    //load the critter mesh
    this.mesh = Loader.parse('../client/models/bunny.obj');
    this.mesh.scale.set(this.scale, this.scale, this.scale);
    this.radius = this.mesh.geometry.boundingSphere.radius * this.scale / 2;

    // Make position center of critter, not bottom by shifting mesh down
    this.mesh.position.copy(this.position);
    this.mesh.position.setY(this.position.y - this.radius);
    this.mesh.matrixWorld.makeTranslation(this.position.x,
        this.position.y - this.radius,
        this.position.z);

    //need to compute geometry face normals for raycaster intersections
    this.mesh.geometry.computeFaceNormals();
    this.speed = 0.01;
}
util.inherits(Critter, Movable);

Critter.prototype.move = function() {
    var rotateMatrix = new THREE.Matrix4();
    rotateMatrix.makeRotationY(this.speed);
    //this.mesh.matrixWorld.multiply(rotateMatrix);
    this.position.applyMatrix4(rotateMatrix);
    /*this.position.set(this.mesh.matrixWorld.elements[12],
                      this.mesh.matrixWorld.elements[13],
                      this.mesh.matrixWorld.elements[14],
                      1);*/
}

module.exports = Critter;
