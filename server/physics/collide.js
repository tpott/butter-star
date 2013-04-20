/**
 * @fileoverview Object that should handle collisions with other objects.
 *
 * @author Jennifer Fang
 */

// Get external functions
var THREE = require('three');

var Game = require('./../objects/game.js');
var Player = require('./../objects/player.js');
var randomID = require('./../objects/random.js');

/**
 * Creates a Collidable object.
 * @constructor
 * @param {wsWebSocket} socket The websocket to connect to.
 * @param {Game} game The game this Collidable belongs to.
 * @param {Array} objList List of things this object can collide with.
 */
function Collidable(socket, game, objList) {
  // Set up which game this Collidable belongs to
  this.socket = socket;
  this.game = game;
  this.id = randomID(16);

  this.collidables = objList;

  // from Thinh
  this.position = {
		x : 0,
		y : -2,
		z : 0,
		direction : 0
	};
  // TODO remove for bunnies??
	this.camera = {
		speed : 300,
		distance : 5,
		x : 0,
		y : 0, 
		z : 0
	};

  var geometry = new THREE.CubeGeometry(1,3,1);
  var material = new THREE.MeshBasicMaterial({color: 0xffffff});
  this.cube = new THREE.Mesh(geometry, material);

  console.log('New collidable: %s', this.id);
  this.socket.send('ID:' + this.id);
  this.game.sendUpdateFrom(this);
};

/**
 * Wrap the Collidable as an object.
 * @return {object}
 */
Collidable.prototype.toObj = function() {
  var obj = {};
  obj.id = this.id;
  obj.position = this.position;
  obj.camera = this.camera;
  return obj;
};

/**
 * Try to move the object in the given direction.
 * @param evt A movement event.
 */
Collidable.prototype.move = function(evt) {
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

	var deltaX = -1 * (Math.sin(direction * Math.PI / 180) * speed);
  var deltaY = 0; // TODO gravity?
	var deltaZ = -1 * (Math.cos(direction * Math.PI / 180) * speed);

  var raycaster = new THREE.Raycaster();
  raycaster.ray.direction.set(deltaX, deltaY, deltaZ);
  raycaster.ray.origin.set(
      this.position.x, this.position.y, this.position.z);

  var intersections = raycaster.intersectObjects(this.collidables);
  if (intersections.length > 0) {
    // TODO idk what this is for :( why index 0?
    var distance = intersections[0].distance;
    
    if(distance > 0) { // TODO is this right?
    }
  } else { // no intersections, can move normally
    this.position.x += deltaX;
    this.position.y += deltaY;
    this.position.z += deltaZ;
  }
};

module.exports = Collidable;
