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

/**
 * Constructor for a player. Makes a mesh that is the same as the
 * client-side mesh for a player. The player is represented by a cube.
 * @constructor
 * @param {wsWebSocket} socket The socket this player is connected through.
 */
function Player(socket) {
  Player.super_.call(this, socket);

  // Dimensions of player
  this.width = 1;
  this.height = 3;
  this.depth = 1;

  // 3D object this represents
  var geometry = new THREE.CubeGeometry(
      this.width, this.height, this.depth);
  var material = new THREE.MeshBasicMaterial({color: 0xffffff});
  this.mesh = new THREE.Mesh(geometry, material);

  // TODO necessary? -Trevor
	this.camera = {
		distance : 5,
		x : 0,
		y : 0,
		z : 0
	};

	console.log('Player class, New player: %s', this.id);
	this.socket.send('ID:' + this.id);
}
util.inherits(Player, Movable);

/**
 * Calculate player movements and let superclass handle collisions and
 * set actual player movements.
 * @param {Event} evt The player movement event.
 */
// TODO see todo in movable's move method
Player.prototype.move = function(evt, collidables) {
  var speed = evt.speed;
	if(evt.sprinting === true) {
		evt.speed = 0.75;
	}
	else {
		evt.speed = 0.25;
	}

	var direction = evt.angle;
  // TODO can we change these to bitmasks?
  if(evt.front && !evt.Backwards) {
    if(evt.left && !evt.right) {
      direction += 45;
    } else if(!evt.left && evt.right) {
      direction += 315;
    } else { //only forward
      direction += 0;
    }
  } else if(!evt.front && evt.Backwards) {
    if(evt.left && !evt.right) {
      direction += 135;
    } else if(!evt.left && evt.right) {
      direction += 225;
    } else { //only back
      direction += 180;
    }
  } else if(evt.left && !evt.right
      && !evt.front && !evt.Backwards) { // only left
    direction += 90;
  } else if(!evt.left && evt.right
      && !evt.front && !evt.Backwards) { // only right
    direction += 270;
  }

	var dx = -1 * (Math.sin(direction * Math.PI / 180) * speed);
  var dy = 0;
	var dz = -1 * (Math.cos(direction * Math.PI / 180) * speed);
  /*Player.super_.prototype.move.call(this, dx, dy, dz);*/

	var magicAmplifier = 0.01;
	var force = new THREE.Vector4(dx, dy, dz, 0)
		.multiplyScalar(magicAmplifier);

	// TODO remove
  // Handle movement and collisions
  //Player.super_.prototype.move.call(this, dx, dy, dz);

  // should resolve to super_.addForce
  this.addForce(force);
};

/**
 * Updates the position of the vacuum effect.
 * @param {Event} playerEvent The player movement event.
 */
// TODO make a vacuum obj. players should have a vacuum obj.
Player.prototype.updateVacuum = function(playerEvent)
{
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
		if(playerEvent.moving == true)
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
