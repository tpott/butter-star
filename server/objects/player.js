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

var STANDING_STILL = 0,
	 MOVING = 1,
	 VACUUMING = 2;

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

	this.state = STANDING_STILL;
}
util.inherits(Player, Movable);

/**
 * Calculate player movements and let superclass handle collisions and
 * set actual player movements.
 * @param {Event} evt The player movement event (string).
 */
Player.prototype.move = function(evt) {
	// MAGIC NUMBER
	var speed = 0.125;

	var direction = 0;
	
	if (Events[evt] == Events['MOVE_FORWARD']) {
		direction = 0;
	}
	else if (Events[evt] == Events['MOVE_BACKWARD']) {
		direction = 180;
	}
	else if (Events[evt] == Events['MOVE_LEFT']) {
		direction = 90;
	}
	else if (Events[evt] == Events['MOVE_RIGHT']) {
		direction = 270;
	}
	else {
		console.log("Event '%s' is not a player move event", evt);
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
	//var rotationY = new THREE.Matrix4().makeRotationZ(mouse[1] * speed);
	//var rot = rotationX.multiply(rotationY);
	var rot = rotationX;

	//this.orientation = rot.multiply(this.orientation);
	this.orientation.applyMatrix4(rot);
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
