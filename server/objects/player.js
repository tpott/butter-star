/**
 * player.js
 *
 * An abstraction of a serverside player object.
 * @author Trevor Pottinger
 * @author Rohan Halliyal
 * @author Jennifer Fang
 */

// Get external functions
var THREE = require('three');
var util = require('util');

var Movable = require('./movable.js');
var Collidable = require('./collidable.js');
var Events = require('../controls/handler.js');

// player states
var STANDING_STILL = 0,
	 MOVING_FORWARD = 1,
	 MOVING_BACKWARD = 2,
	 MOVING_LEFT = 4,
	 MOVING_RIGHT = 8,
	 VACUUMING = 16,
	 JUMPING = 32;

/**
 * Constructor for a player. Makes a mesh that is the same as the
 * client-side mesh for a player. The player is represented by a cube.
 * @constructor
 * @param {wsWebSocket} socket The socket this player is connected through.
 */
function Player(socket) {
  Player.super_.call(this);

  // TODO socket not needed?
  this.socket = socket;

  // Dimensions of player
  // TODO get from model
  this.width = 1;
  this.height = 3;
  this.depth = 1;

  // 3D object this represents
  // TODO make this load the player model. Trevor: keep the radius line!
  var geometry = new THREE.CubeGeometry(
      this.width, this.height, this.depth);
  var material = new THREE.MeshBasicMaterial();
  this.mesh = new THREE.Mesh(geometry, material);
  this.radius = this.mesh.geometry.boundingSphere.radius;

  this.keyPresses = [];

  // TODO necessary? -Trevor
	this.camera = {
		speed : 1,
		distance : 5,
		x : 0,
		y : 0,
		z : 0
	};

  // Vacuum stuff
  this.vacTrans = new THREE.Vector3();
  this.initVacPos = null;
  this.direction = null;
  this.isVacuum = false;
  this.vacAngleY = 0;

  this.type = Collidable.types.PLAYER;

  console.log('Player class, New player: %s', this.id);

  this.state = STANDING_STILL; // current state of player
  this.numVacKills = 0; // counter for number of vacuumed objects
  this.raycaster = null;
}
util.inherits(Player, Movable);

Player.prototype.incVacKills = function() {
    this.numVacKills++;
}

Player.prototype.getVacKills = function() {
    return this.numVacKills;
}

Player.prototype.resetVacKills = function() {
    this.numVacKills = 0;
}

/*
 * Checks for intersection with objects and returns the closest
 * intersected objects
 */
Player.prototype.getVacIntersectionObj = function(critters) {
    // check to make sure player state is vacuuming
    if (!(this.state & VACUUMING)) {
        return;
    }
    var origin = new THREE.Vector3().copy(this.position);
    var vector = new THREE.Vector3().copy(this.orientation);
    this.raycaster = new THREE.Raycaster(origin, vector);
    for (key in critters) {
        var intersects = this.raycaster.intersectObject(critters[key].mesh);
        // check if any intersections within vacuum distance
        // TODO: don't hardcode vacuum distance
        if(intersects.length > 0 && intersects[0].distance < 10) {
            return critters[key]; // return closest critter
        }
    }
    return null; // no intsections
}

Player.prototype.setDefaultState = function() {
	this.state = STANDING_STILL;
}

Player.prototype.updateState = function(evt) {
	switch (Events[evt]) {
		case Events['MOVE_FORWARD']:
			this.state ^= MOVING_FORWARD;
			break;
		case Events['MOVE_BACKWARD']:
			this.state ^= MOVING_BACKWARD;
			break;
		case Events['MOVE_LEFT']:
			this.state ^= MOVING_LEFT;
			break;
		case Events['MOVE_RIGHT']:
			this.state ^= MOVING_RIGHT;
			break;
		case Events['VACUUM']:
			this.state ^= VACUUMING;
			break;
		case Events['JUMPING']:
			this.state ^= JUMPING;
			break;
	}

	this.moved = true;
}

Player.prototype.isMoving = function() {
	return this.state & MOVING_FORWARD || this.state & MOVING_BACKWARD ||
		this.state & MOVING_LEFT || this.state & MOVING_RIGHT;
}

/**
 * Calculate player movements and let superclass handle collisions and
 * set actual player movements.
 * @param {Event} evt The player movement event (string).
 */
Player.prototype.move = function() {
	if (! this.isMoving() ) {
		return;
	}

	// MAGIC NUMBER
	var speed = 0.125;

	// TODO not use y-axis as up? 
	// an Up vector in OUR world
	var up = new THREE.Vector4(0, 1, 0, 0);

	// up becomes the orientation projected upwards
	up.multiplyScalar(up.dot(this.orientation));

	// projected is the orientation projected onto the x-z (horizontal) plane
	var projected = this.orientation.clone().sub(up);

	// divide by length for normalization
	// acos returns radians, but Math.sin and cos take degrees... 
	var direction = 180 * Math.acos(projected.dot(new THREE.Vector4(1,0,0,0)) /
			projected.length()) / Math.PI;;
	
	if (this.state & MOVING_FORWARD) {
		direction += 0;
	}
	else if (this.state & MOVING_BACKWARD) {
		direction += 180;
	}
	else if (this.state & MOVING_LEFT) {
		direction += 90;
	}
	else if (this.state & MOVING_RIGHT) {
		direction += 270;
	}

	var dx = -1 * (Math.sin(direction * Math.PI / 180) * speed);
	var dy = 0;
	var dz = -1 * (Math.cos(direction * Math.PI / 180) * speed);

	//var magicAmplifier = 0.8;
	var force = new THREE.Vector4(dx, dy, dz, 0);

  // should resolve to super_.addForce
  this.addForce(force);
};

Player.prototype.toggleVacuum = function() {
	// XOR
	this.state ^= VACUUMING;
	console.log("Player %s %s vacuuming", this.id, 
			this.state & VACUUMING ? "is" : "is not");
};

/**
 * rotates the player based off the mouse movement
 */
Player.prototype.rotate = function(mouse) {
	// TODO client config
	var speed = 0.01;

	// the Y-axis is the "up" in our game
	var rotationX = new THREE.Matrix4().makeRotationY(mouse[0] * speed);
	var rotationY = new THREE.Matrix4().makeRotationZ(mouse[1] * speed);
	var rot = rotationX.multiply(rotationY);
	//var rot = rotationX;

	//this.orientation = rot.multiply(this.orientation);
	this.orientation.applyMatrix4(rot);

	// necessary for graphics to be updated
	this.moved = true;
};

/**
 * Updates the position of the vacuum effect.
 * @param {Event} playerEvent The player movement event.
 */
// TODO make a vacuum obj. players should have a vacuum obj.
Player.prototype.updateVacuum = function(playerEvent) {
	//player done vacuum'in
	if(playerEvent.isVacuum == false)
		this.initVacPos = null;

	//either continuing or began vacuum'in
	if(playerEvent.isVacuum == true)
	{
		//begin vacuum
		if(this.initVacPos == null)
		{
			var x = this.position.x;
			var y = this.position.y;
			var z = this.position.z;
			this.initVacPos = {x:x,y:y,z:z};
			this.vacTrans.set(0,0,0);
		}

		//vacuum while moving
		//if(playerEvent.moving == true)
		else
        {
			var dx = this.position.x - this.initVacPos.x;
			var dy = this.position.y - this.initVacPos.y;
			var dz = this.position.z - this.initVacPos.z;
			this.vacTrans = new THREE.Vector3(dx,dy,dz);
		}
	}			
};

function PlayerEvent() {
    this.playerID  = -1;
    this.moving    = false;
    this.front     = false;
    this.Backwards = false;
    this.left      = false;
    this.right     = false;
    this.sprinting = false;
    this.speed     = .25;
    this.angle     = 0;
	this.isVacuum  = false;
}

module.exports = Player;
module.exports.Event = PlayerEvent;
