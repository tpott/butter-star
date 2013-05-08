/**
 * @fileoverview Object that should handle movement and collisions with
 * other objects.
 *
 * @author Jennifer Fang
 * @author Thinh Nguyen
 */

// Get external functions
var THREE = require('three');
var util = require('util');

var Collidable = require('./collidable.js');

/**
 * Creates a Movable object. Should not instantiate this class.
 * @constructor
 */
function Movable() {
  Movable.super_.call(this);

  // Dummy dimensions and mesh. Will be created in subclasses.
  this.width = 0; // x axis
  this.height = 0; // y axis
  this.depth = 0; // z axis
  this.mesh = null;
  this.radius = 0;

  this.position = new THREE.Vector4(0, 0, 0, 0);
  this.orientation = new THREE.Vector4(1, 0, 0, 0);
  this.center = new THREE.Vector4(0, 0, 0, 0);

  this.velocity = new THREE.Vector4(0, 0, 0, 0);
  this.force = new THREE.Vector4(0, 0, 0, 0);
  this.mass = 1.0;
};
util.inherits(Movable, Collidable);

/**
 * Returns true that the movable has a bounding sphere.
 * @return {boolean} True if this collidable has a bounding sphere,
 *     false otherwise.
 * @override
 */
Movable.prototype.hasBoundingSphere = function() {
  return true;
};

/**
 * Calculate the center of your object. The position is at the base of the object.
 * @return {THREE.Vector4} The point where the center of the object is.
 * @private
 */
Movable.prototype.getCenter_ = function() {
	// TODO this seems hacky
  this.center.set(
      this.position.x + (this.width / 2),
      this.position.y + (this.height / 2),
      this.position.z + (this.depth / 2),
      1 // a point rather than a vector
  );
  return this.center;
};

/**
 * Check if the object will collide with another object.
 * @param {Array.<Collidable>} collidables List of collidables.
 * @return {Collidable} The closest object that was collided with. 
 * TODO all objs later?
 * @private
 */
Movable.prototype.detectCollision_ = function(collidables) {
  var intersectedObjs = [];

  // TODO position or center?
  // TODO velocity or displacement
  var newPos = this.position.clone().add(this.velocity);
  /*
  // TODO don't want to say new every collision?
  var projectedCenter = new THREE.Vector4(0,0,0,1);
  projectedCenter.copy(this.getCenter_());
  projectedCenter.add(this.velocity);
  
  var dp = new THREE.Vector4(0, 0, 0, 1); // change in position set below
  */

  for (var id in collidables) {
	  i++;
    // Don't try to collide against self
    if (id == this.id) {
      continue;
    }

    var collidable = collidables[id]; // Object checking collision against
    //var intersecting = false;
    // Case for everything except walls/floors/ceilings
	 //  this implies getCenter is defined
    if (collidable.hasBoundingSphere() === true) {
		 // TODO new call
		 var distance = new THREE.Vector4()
			 .subVectors(this.getCenter_(), collidable.getCenter_())
			 .length();

		 // TODO this is really simple
		 if (distance < this.radius + collidable.radius) {
			 intersectedObjs.push(collidable);
			 continue;
		 }
		 
		 /*
      dp.copy(collidable.getCenter_())
      dp.sub(projectedCenter);

      var minDist = this.radius + collidable.radius;
      var overlapDistSq = dp.x * dp.x + dp.y * dp.y + dp.z * dp.z;

      var t1t2 = overlapDistSq - minDist * minDist;
      // Intersecting already
      if (t1t2 < 0) {
        intersecting = true;
      } else { // not already intersecting
        var pv = dp.x * this.velocity.x * -1
            + dp.y * this.velocity.y * -1
            + dp.z * this.velocity.z * -1;
        if (pv < 0) { // spheres not moving away from each other
          var vSquared = this.velocity.x * this.velocity.x
              + this.velocity.y * this.velocity.y
              + this.velocity.z * this.velocity.z;

          // Spheres will intersect
          if (!(((pv + vSquared) <= 0) && ((vSquared + 2 * pv + t1t2) >= 0))) {
            var t1 = -1 * pv / vSquared;
            if (t1t2 + pv * t1 >= 0) {
              intersecting = true;
            }
          }
        }
      }

      if (intersecting === true) {
        intersectedObjs.push(collidable);

        // Back out of object
        // TODO momentum? both objects bounce back?
        var overlapDist = Math.sqrt(overlapDistSq);
        var backDist = minDist - overlapDist;
        var backMagnitudeRatio = backDist / overlapDist;
        var targetCenter = collidable.getCenter_();
        var backVector = new THREE.Vector4(
            (projectedCenter.x - targetCenter.x) * backMagnitudeRatio,
            (projectedCenter.y - targetCenter.y) * backMagnitudeRatio,
            (projectedCenter.z - targetCenter.z) * backMagnitudeRatio
        );

        // Update projectedCenter for next iteration
        this.velocity.add(backVector);
        projectedCenter.add(backVector);
      }
		*/
    } 
	 else { // Case for walls/floors/ceilings
		 for (var i = 0; i < collidable.mesh.geometry.faces.length; i++) {
			 var face = collidable.mesh.geometry.faces[i];
			 // TODO position or center
			 var oldFacingFront = face.normal().dot(this.position) > 0;
			 var newFacingFront = face.normal().dot(newPos) > 0;

			 if (oldFacingFront !== newFacingFront) {
				intersectedObjs.push(collidable);
				break; // should break collidable for loop as well
			 }
		 }
    }
  }

  /*
  var collidable = null;
  if (intersectedObjs.length > 0) { // at least one intersection
    collidable = {
        obj: intersectedObjs[0], // TODO
        vector: this.velocity
    };
  }
  */

  return intersectedObjs;
};

/**
 * Apply the current force vector4 to the current position.
 * Collision detection should be applied here (not defined).
 * @param {Array.<Collidable>} collidables List of collidables.
 */
Movable.prototype.applyForces = function(collidables) {
	// Force = mass * acceleration 
	var acceleration = this.force.multiplyScalar(1.0 / this.mass);

	// integration, then change velocity
	// TODO don't hardcode timelapse
	var timeLapse = 1000.0 / 60.0;
	this.velocity.add(acceleration.multiplyScalar(timeLapse));

	var collisions = this.detectCollision_(collidables);

	if (collisions.length != 0) {
		console.log("Collision: %d", collisions.length);
		// TODO not use 0th index
		var mu = collisions[0].friction;
		this.force.copy(mu * this.velocity.clone().multiplyScalar(-1.0));

		//this.position.add(collisions.vector);
		this.force.set(0, 0, 0, 0);
	}
	else {
		// TODO before or after changing velocity?
		this.position.add(this.velocity);

		// reset forces, because all of these have been applied
		this.force.set(0, 0, 0, 0);
	}
};

/**
 * Add a force vector4 that can be applied at the end of this
 * game tick.
 * @param {THREE.Vector4} v the force to be added
 */
Movable.prototype.addForce = function(v) {
	this.force.add(v);
};

/**
 * Add gravity force to the net force.
 */
Movable.prototype.addGravity = function() {
  this.force.add(this.gravity);
};

module.exports = Movable;
