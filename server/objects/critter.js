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
	this.hp = 30;
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

    this.speed = 0.01; // speed of critter rotation 
    this.rotation; // determines if rotating clockwise or counterclockwise 
    this.rotation_point; // determines the point in which critter rotates around
}
util.inherits(Critter, Movable);

Critter.prototype.move = function() {
    //start at origin
    var originPos = new THREE.Vector3(0,0,0);
    
    //calculate translation between this.position and this.rotation_point
    var transVector = new THREE.Vector3();
    transVector.subVectors(this.position, this.rotation_point);
    var transMatrix = new THREE.Matrix4();
    transMatrix.makeTranslation(transVector.x, transVector.y, transVector.z);
    
    //calculate translation between origin and this.rotation_point
    var translateMatrix = new THREE.Matrix4();
    translateMatrix.makeTranslation(this.rotation_point.x, 
                                    this.rotation_point.y, 
                                    this.rotation_point.z);

    //calculate rotation matrix
    var rotateMatrix = new THREE.Matrix4();
    if (this.rotation == 0) {
        rotateMatrix.makeRotationY(this.speed);
    } else {
        rotateMatrix.makeRotationY(-this.speed);
    }

    //save old position
    var old_position = new THREE.Vector4().copy(this.position);
    
    // translate from rotation point to position
    originPos.applyMatrix4(transMatrix);
    // rotate
    originPos.applyMatrix4(rotateMatrix);
    // move whole rotation to the new center which is rotation point
    originPos.applyMatrix4(translateMatrix);
    this.position.copy(originPos);

    //determine orientation from change in position
    this.orientation.subVectors(this.position, old_position);
    this.orientation.normalize();
}

module.exports = Critter;
