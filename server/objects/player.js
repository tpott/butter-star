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

var Movable = require('./../physics/movable.js');

function Player(socket, game) {
  Player.super_.call(this, socket, game);

  // 3D object this represents
  var geometry = new THREE.CubeGeometry(1,3,1); // TODO change this size
  var material = new THREE.MeshBasicMaterial({color: 0xffffff});
  this.cube = new THREE.Mesh(geometry, material);

	//console.log('New player: %s', this.id);
	this.socket.send('ID:' + this.id);
	this.game.sendUpdateFrom(this);
}
util.inherits(Player, Movable);

/**
 * Calculate player movements and let superclass handle collisions and
 * set actual player movements.
 * @param {Event} evt The player movement event.
 */
Player.prototype.move = function(evt) {
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
  var dy = 0; // TODO gravity?
	var dz = -1 * (Math.cos(direction * Math.PI / 180) * speed);

  // Handle movement and collisions
  Player.super_.prototype.move.call(this, dx, dy, dz);
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
}

module.exports = Player;
module.exports.Event = PlayerEvent;

