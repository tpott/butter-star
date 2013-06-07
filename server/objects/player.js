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

var Collidable = require('./collidable.js');
var Events = require('../controls/handler.js');
var Loader = require('./OBJLoader.js');
var Movable = require('./movable.js');

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
 */
function Player() {
  Player.super_.call(this);
  
  this.scale = 0.06;

  // 3D object this represents
  this.mesh = Loader.parse('../client/models/yellow_boy_standing.obj');
  this.mesh.scale.set(this.scale, this.scale, this.scale);
  this.radius = this.mesh.geometry.boundingSphere.radius * this.scale / 2;

  // Make position center of player, not bottom by shifting mesh down
  this.mesh.position.copy(this.position);
  this.mesh.position.setY(this.position.y - this.radius);
  this.mesh.matrixWorld.makeTranslation(this.position.x,
      this.position.y - this.radius,
      this.position.z);

  this.mesh.geometry.computeFaceNormals(); // needed for raycaster collisions

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
  this.prevNumVacKills = -1; // used to see if num vacuumed changed

  // Vacuum charge percentage
  this.vacuumCharge = 100; // counter for % vacuum battery remaining
  this.prevVacuumCharge = -1; // used to see if num vacuumed changed
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
    this.prevNumVacKills = -1;
}

/**
 * Check if kill counter should be updated. Used by server/objects/game.js.
 * @return {boolean} True if kill count updated, false otherwise.
 */
Player.prototype.didKillsChange = function() {
  if (this.prevNumVacKills != this.numVacKills) {
    this.prevNumVacKills = this.numVacKills;
    return true;
  }
  return false;
};

/**
 * Decrease the vacuum charge by 1%.
 */
Player.prototype.decVacuumCharge = function() {
  if (this.vacuumCharge > 0) {
    this.vacuumCharge--;
  }
};

/**
 * Increase the vacuum charge by 1%.
 */
Player.prototype.incVacuumCharge = function() {
  if (this.vacuumCharge < 100) {
    this.vacuumCharge++;
  }
};

/**
 * Set the vacuum charge value.
 * @param {int} charge The amount of charge to set the vacuum to.
 */
Player.prototype.setVacuumCharge = function(charge) {
  this.vacuumCharge = charge;
};

/**
 * Get the vacuum charge value.
 * @return {int} The amount of charge in the vacuum.
 */
Player.prototype.getVacuumCharge = function() {
  return this.vacuumCharge;
};

/**
 * Check if player has enough charge to vacuum.
 * @return {boolean} True if enough charge to vacuum, false otherwise.
 */
Player.prototype.canVacuum = function() {
  return (this.vacuumCharge > 0);
};

/**
 * Check if the vacuum charge should be updated. Used by server/objects/game.js
 * @return {boolean} True if vacuum charge updated, false otherwise.
 */
Player.prototype.didVacuumChargeChange = function() {
  if (this.prevVacuumCharge != this.vacuumCharge) {
    this.prevVacuumCharge = this.vacuumCharge;
    return true;
  }
  return false;
};

/**
 * Use the vacuum. If not in use, charge the vacuum.
 * @param {Array.<Critter>} critters The possible critters to vacuum.
 * @param {Critter} The closest critter the vacuum intersected with.
 */
Player.prototype.doVacuum = function(critters, items) {
    // check to make sure player state is vacuuming
    if (!(this.state & VACUUMING)) {
        this.incVacuumCharge();
        return null;
    }

    this.decVacuumCharge();

    if (this.canVacuum() === true) {
      return this.getVacIntersectionObjs(critters, items);
    } else {
      return null;
    }
};

function isNegative(number)
{
	if(number < 0.0)
		return true;
	return false;
}

Player.prototype.getOffsetPosition = function() {
	var orientation3 = new THREE.Vector3().copy(this.orientation);
	var position = this.position.clone();
	var a = new THREE.Vector3(this.orientation.x,0,this.orientation.z);
	var b = new THREE.Vector3(0,1,0);
	var direction = a.cross(b);
	direction.normalize();
	direction = direction.multiplyScalar(1.05);
	var zProjection = this.orientation.clone();
	zProjection.multiplyScalar(1.5);
	var offset = zProjection.addVectors(zProjection,direction);
	offset.y += 0.5
	position = position.addVectors(position,offset);
    position.w = 1;
    return position;
}

Player.prototype.checkHit = function(collidable, mindistance, minangle) {
    var position = this.getOffsetPosition();
    var diffVec = collidable.position.clone().sub(position);
    var distance = diffVec.length();

    if (distance > mindistance) {
        return null;
    }

    var cosAngle = diffVec.dot(this.orientation) / distance;

    var angle = Math.acos(cosAngle) * (180.0 / Math.PI);

    if (angle <= minangle) {
        return collidable;
    }
    return null;
}
/*
 * Checks for intersection with objects and returns the closest
 * intersected objects
 */
Player.prototype.getVacIntersectionObjs = function(critters, items) {
    var ret_objs = {}; // table of intersected objects to return
    var close_objs= {}; // table of critters within vacuum range
    
    // short circuit
    if (Object.keys(critters).length == 0) {
        return ret_objs;
    }

    //optimizations
    for (key in critters) {
        if (Math.abs(this.position.x - critters[key].position.x) <= 10 &&
            Math.abs(this.position.z - critters[key].position.z) <= 10) {
            close_objs[key] = critters[key];  
        }
    }
    for (key in items) {
        if (items[key] != null &&
            Math.abs(this.position.x - items[key].position.x) <= 10 &&
            Math.abs(this.position.z - items[key].position.z) <= 10) {
            close_objs[key] = items[key];  
        }
    }

    for (key in close_objs) {
        var obj = this.checkHit(close_objs[key], 10, 45);
        if (obj != null) {
            ret_objs[key] = obj;
        }
    }

    return ret_objs;
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
  //console.log(this.isMoving());
	if (! this.isMoving() ) {
    //console.log("this isnt moving");
		return;
	}

  //dont let the player move if they press both left + right or up + down at the same time
  if(this.state == 12 || this.state == 3 || this.state == 28 || this.state == 19)
  {
    return;
  }

  //console.log(this.state);

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
  //console.log(projected.dot(new THREE.Vector4(1,0,0,0)) / projected.length() );
  var direction = 180.0 * Math.acos(projected.dot(new THREE.Vector4(1,0,0,0)) / projected.length() ) / Math.PI;	

 /* 
  if (this.state & MOVING_FORWARD) {
	}
	else if (this.state & MOVING_BACKWARD) {
		direction += 180;
	}
	else if (this.state & MOVING_LEFT) {
		if(projected.z > 0)
    {
      direction += 270;
    }
    else
    {
      direction += 90;
    }
  }
	else if (this.state & MOVING_RIGHT) {
		if(projected.z > 0)
    {
      direction += 90;
    }
    else
    {
    direction += 270;
	  }
  }

  if(projected.z > 0)
  {
    direction = -direction;
  }

  */

if(projected.z > 0)
   {
     if(this.state == 1 || this.state == 17){direction +=   0}
     if(this.state == 5 || this.state == 21){direction += 315}
     if(this.state == 4 || this.state == 20){direction += 270}
     if(this.state == 6 || this.state == 22){direction += 225}
     if(this.state == 2 || this.state == 18){direction += 180}
     if(this.state == 10 || this.state == 26){direction += 135}
     if(this.state == 8 || this.state == 24){direction += 90}
     if(this.state == 9 || this.state == 25){direction += 45} 
   }
else if(projected.z <= 0)
   {
     if(this.state == 1 || this.state == 17){direction +=   0}
     if(this.state == 5 || this.state == 21){direction +=  45}
     if(this.state == 4 || this.state == 20){direction +=  90}
     if(this.state == 6 || this.state == 22){direction += 135}
     if(this.state == 2 || this.state == 18){direction += 180}
     if(this.state == 10 || this.state == 26){direction += 225}
     if(this.state == 8 || this.state == 24){direction += 270}
     if(this.state == 9 || this.state == 25){direction += 315} 
   }

 if(projected.z > 0)
  {
    direction = -direction;
  }
	var dx = 1 * (Math.cos(direction * Math.PI / 180) * speed);
  var dy = 0;
	var dz = -1 * (Math.sin(direction * Math.PI / 180) * speed);

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
 * mouse[0] is delta X mouse coords
 * mouse[1] is delta Y mouse coords
 */
Player.prototype.rotate = function(mouse) {
	// TODO client config
	var speed = 0.01;

	// variables needed for vertical rotation
	var orientation3 = new THREE.Vector3().copy(this.orientation);
	var yaxis = new THREE.Vector3(0, 1, 0);
  
  //console.log(orientation3);

	// vertical rotation math
	var yRotateAxis = new THREE.Vector3().crossVectors(
			yaxis, orientation3).normalize();
	var yRotationMat = new THREE.Matrix4().makeRotationAxis(
			yRotateAxis, mouse[1] * speed);

	// horizontal rotation math
	var xRotateAxis = new THREE.Vector3().crossVectors(
			yRotateAxis, orientation3).normalize();
	var xRotationMat = new THREE.Matrix4().makeRotationAxis(
			xRotateAxis, mouse[0] * speed);

	// rotation matricies should be order independent
	var rot = xRotationMat.multiply(yRotationMat);

	//this.orientation = rot.multiply(this.orientation);
	var newOrientation = new THREE.Vector4().copy(this.orientation);
  newOrientation.applyMatrix4(rot);
 
  this.moved = true;

  //this.orientation.applyMatrix4(rot);
  if(newOrientation.y >= .1)
  {
      //console.log("stop moving down");
      return;
  }
  if(newOrientation.y <= -.5)
  {
      //console.log("stop moving up");
      return;
  }
  
  this.orientation = newOrientation;

	// necessary for graphics to be updated
	//this.moved = true;
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
