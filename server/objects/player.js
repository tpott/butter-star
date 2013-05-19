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
  Player.super_.call(this);

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

	console.log('Player class, New player: %s', this.id);
  // TODO is this the only reason we need socket?
	this.socket.send('ID:' + this.id);
}
util.inherits(Player, Movable);

Player.prototype.checkVacIntersection = function(players) {
    var origin = new THREE.Vector3(this.position.x, this.position.y+.2, this.position.z);
    var vector = new THREE.Vector3(0,0,-1);
    var matrix_x = new THREE.Matrix4();
    var matrix_y = new THREE.Matrix4();
    matrix_x.identity();
    matrix_y.identity();
    //console.log(this.direction);
    //console.log(this.vacAngleY);
    var angleY = this.direction * Math.PI/180.0;
    var angleX = this.vacAngleY * Math.PI/180.0;
    matrix_x.makeRotationX(-angleX);
    matrix_y.makeRotationY(angleY);
    vector.applyMatrix4(matrix_x);
    vector.applyMatrix4(matrix_y);
    //console.log("origin: " + origin.x + " " + origin.y + " " + origin.z);
    //console.log("collidables length : " + Object.keys(collidables).length);
    //console.log("vector: " + vector.x + " " + vector.y + " " + vector.z);
    var raycaster = new THREE.Raycaster(origin, vector);
    for (key in players) {
        if (players[key].id != this.id) {
            //console.log("player: " + this.id + " checking other player " + players[key].id); 
        //console.log("mesh.position " + this.mesh.position.x + " " + this.mesh.position.y + " " + this.mesh.position.z);
        //console.log("other player mesh.position " + players[key].mesh.position.x + " " + players[key].mesh.position.y + " " + players[key].mesh.position.z);
            var intersects = raycaster.intersectObject(players[key].mesh);
            if(intersects.length > 0 && intersects[0].distance < 10) {
                console.log("player: " + this.id + " is intersecting with player: " + players[key].id);
                break;
            }
        }
    }
}

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
		evt.speed = 0.125;
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

	//var magicAmplifier = 0.8;
	var force = new THREE.Vector4(dx, dy, dz, 0);

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
