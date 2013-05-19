/**
 * @fileoverview Object that should handle movement and collisions with
 * other objects.
 *
 * @author Jennifer Fang
 * @author Trevor Pottinger
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

  this.center = new THREE.Vector4(0, 0, 0, 0);

  this.type = Collidable.types.MOVABLE

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
  var correctedVec = this.velocity.clone();

  // TODO position or center?
  // TODO velocity or displacement
  var newPos = this.position.clone().add(this.velocity);
  // TODO don't want to say new every collision?
  var projectedCenter = new THREE.Vector4(0,0,0,1);
  projectedCenter.copy(this.getCenter_());
  projectedCenter.add(this.velocity);
  
  var dp = new THREE.Vector4(0, 0, 0, 1); // change in position set below

  for (var id in collidables) {
	  i++;
    // Don't try to collide against self
    if (id == this.id) {
      continue;
    }

    var collidable = collidables[id]; // Object checking collision against
    var intersecting = false;
	 // skip enemies for now, cause they were covering the floor...
	 if (collidable.radius == 0) {
		 continue;
	 }
    // Case for everything except walls/floors/ceilings
	 //  this implies getCenter is defined
    if (collidable.hasBoundingSphere() === true) {
		 
      dp.copy(collidable.getCenter_())
      dp.sub(projectedCenter);

      var minDist = this.radius + collidable.radius;
      var overlapDistSq = dp.x * dp.x + dp.y * dp.y + dp.z * dp.z;

      var t1t2 = overlapDistSq - minDist * minDist;
      // Intersecting already
      if (t1t2 < 0) {
        intersecting = true;
      } else { // not already intersecting
        var pv = dp.x * correctedVec.x * -1
            + dp.y * correctedVec.y * -1
            + dp.z * correctedVec.z * -1;
        if (pv < 0) { // spheres not moving away from each other
          var vSquared = correctedVec.dot(correctedVec);

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
        // TODO below calculation wrong, but what Trevor put here
        // didn't work because those variables don't exist... ARGH.
        /*
        var overlapDist = Math.sqrt(overlapDistSq);
        var backDist = minDist - overlapDist;
        var backMagnitudeRatio = backDist / overlapDist;
        var targetCenter = collidable.getCenter_();
        // TODO don't say new every time? :(
        var backVector = new THREE.Vector4(
            (projectedCenter.x - targetCenter.x) * backMagnitudeRatio,
            (projectedCenter.y - targetCenter.y) * backMagnitudeRatio,
            (projectedCenter.z - targetCenter.z) * backMagnitudeRatio
        );

        // Update projectedCenter for next iteration
        projectedCenter.add(backVector);
			  correctedVec.add(backVector);
        */
      }
    } 
	  else { // Case for walls/floors/ceilings
		  for (var i = 0; i < collidable.mesh.geometry.faces.length; i++) {
			  var face = collidable.mesh.geometry.faces[i];
			  var normal = new THREE.Vector4(
					 face.normal.x,
					 face.normal.y,
					 face.normal.z,
					 0.0
				);
			  normal.multiplyScalar(-1);

			  var faceCenter = new THREE.Vector4(
					 face.centroid.x,
					 face.centroid.y,
					 face.centroid.z,
					 1.0
				);

			  var oldVec = this.position.clone().sub(faceCenter);
			  var newVec = newPos.clone().sub(faceCenter);

			  // TODO position or center
			  var oldFacingFront = normal.dot(oldVec) > 0;
			  var newFacingFront = normal.dot(newVec) > 0;

			  if (oldFacingFront !== newFacingFront) {
				  var projected = normal.multiplyScalar(normal.dot(newVec) /
					  	 normal.length());
				  intersectedObjs.push(collidable);
				  correctedVec.sub(projected);
			  }

			  // check for distance
			  // TODO

        /*
        var plane = normal.dot(faceCenter);
        var startDistToWall = normal.dot(this.getCenter_()).sub(plane);
        var endDistToWall = normal.dot(projectedCenter).sub(plane);

        // Check if already intersecting wall
        if (Math.abs(startDistToWall) <= this.radius) {
          intersecting = true;
        } else {
          var negRadius = -1 * this.radius;
          // Check if movement will cross the wall
          if ((startDistToWall > this.radius && endDistToWall < negRadius)
              || (startDistToWall < negRadius && endDistToWall > this.radius)) {
            intersecting = true;
          }
        }

        */

        // TODO correcting for intersection
		  } // end loop over faces
    } // end else for walls/floors/ceilings
  }

  var collidable = null;
  if (intersectedObjs.length > 0) { // at least one intersection
    collidable = {
        obj: intersectedObjs[0], // TODO
        vector: correctedVec
    };
  }

  return collidable;
};

/**
 * Apply the current force vector4 to the current position.
 * Collision detection should be applied here (not defined).
 * @param {Array.<Collidable>} collidables List of collidables.
 * @return {boolean} True if moved, false otherwise.
 */
Movable.prototype.applyForces = function(collidables) {
  var originalPosition = {x: this.position.x,
      y: this.position.y,
      x: this.position.zi
  };

	// Force = mass * acceleration 
	var acceleration = this.force.multiplyScalar(1.0 / this.mass);

	// integration, then change velocity
	// TODO don't hardcode timelapse
	var timeLapse = 1000.0 / 60.0;
	this.velocity.add(acceleration.multiplyScalar(timeLapse));

	var collision = this.detectCollision_(collidables);

	if (collision != null) {
		// TODO not use 0th index
		var mu = collision.obj.friction; // collison.obj is a collidable
		this.force.copy(collision.vector).multiplyScalar(-1 * mu);

		// collision.vector is the corrected vector
		this.position.add(collision.vector);
		this.velocity.copy(collision.vector); // TODO unecessary copy?
		//this.force.set(0, 0, 0, 0);
	}
	else {
		// TODO before or after changing velocity?
		this.position.add(this.velocity);

		// reset forces, because all of these have been applied
		this.force.set(0, 0, 0, 0);
	}

  // Check if movable changed positions
  // TODO check if just using .equals() would mess up
  if (originalPosition.x == this.position.x &&
      originalPosition.y == this.position.y &&
      originalPosition.z == this.position.z) {
    return false;
  } else {
    return true;
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
