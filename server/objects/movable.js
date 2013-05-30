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
  this.mesh = null;
  this.radius = 0;

  this.type = Collidable.types.MOVABLE;

  this.velocity = new THREE.Vector4(0, 0, 0, 0);
  this.force = new THREE.Vector4(0, 0, 0, 0);
  this.mass = 1.0;

  // used to optimize networking
  this.moved = false;
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
 * Check if the object will collide with another object.
 * @param {Array.<Collidable>} collidables List of collidables.
 * @return {Collidable} The closest object that was collided with. 
 * @private
 */
Movable.prototype.detectCollision_ = function(collidables) {
  var intersectedObjs = [];
  var correctedVec = this.velocity.clone();
  var meshCorrection = new THREE.Vector4(0,0,0,0);

  var newPos = this.position.clone().add(this.velocity);

  var projectedCenter = new THREE.Vector4(0,0,0,1); // should be same as newPos
  projectedCenter.copy(this.position);
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

    // Case for everything except walls/floors/ceilings
    if (collidable.hasBoundingSphere() === true) {
      /*
      dp.copy(collidable.position)
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
        var overlapDist = Math.sqrt(overlapDistSq);
        var backDist = minDist - overlapDist;
        var backMagnitudeRatio = backDist / overlapDist;
        var targetCenter = collidable.position;
        var backVector = new THREE.Vector4(
            (projectedCenter.x - targetCenter.x) * backMagnitudeRatio,
            (projectedCenter.y - targetCenter.y) * backMagnitudeRatio,
            (projectedCenter.z - targetCenter.z) * backMagnitudeRatio
        );

        // Update projectedCenter for next iteration
        projectedCenter.add(backVector);
			  correctedVec.add(backVector);
      }
      */
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

        // check if any side of this object will hit the walls
        for (var j = 0; j < 6; j++) {
          var oldVec = this.position.clone().sub(faceCenter);
          var newVec = newPos.clone().sub(faceCenter);

          var coordType = j % 3;
          var sign = ((j % 2) === 0) ? 1 : -1;
          var signedRadius =
              ((j % 2) === 0) ? (this.radius) : (-1 * this.radius);
          if (coordType === 0) { // try adjusting for radius in x dir
            oldVec.setX(oldVec.x + signedRadius);
            newVec.setX(newVec.x + signedRadius);
          } else if (coordType === 1) { // try adjusting for radius in y dir
            oldVec.setY(oldVec.y + signedRadius);
            newVec.setY(newVec.y + signedRadius);
          } else if (coordType === 2) { // try adjusting for radius in z dir
            oldVec.setZ(oldVec.z + signedRadius);
            newVec.setZ(newVec.z + signedRadius);
          }

          var oldFacingFront = normal.dot(oldVec) > 0;
          var newFacingFront = normal.dot(newVec) > 0;

          if (oldFacingFront !== newFacingFront) {
            // projected is how much through the wall it went
            var projected = normal.multiplyScalar(normal.dot(newVec) /
                 normal.length());
            intersectedObjs.push(collidable);
            correctedVec.sub(projected);

            // If going through wall, correct position to be at edge of wall
            // NOTE(jyfang): Magic numbers below are because player x,z velocity
            // too high -> goes through wall, therefore need extra correction
            if ((projected.x < 0) && (coordType === 0)) {
              meshCorrection.setX(face.centroid.x + this.radius + 0.2);
            } else if((projected.x > 0) && (coordType === 0)) {
              meshCorrection.setX(face.centroid.x - this.radius - 0.2);
            } else if (projected.y < 0) {
              meshCorrection.setY(face.centroid.y + this.radius);
            } else if (projected.y > 0) {
              meshCorrection.setY(face.centroid.y - this.radius);
            } else if ((projected.z < 0) && (coordType === 2)) {
              meshCorrection.setZ(face.centroid.z + this.radius + 0.2);
            } else if ((projected.z > 0) && (coordType === 2)) {
              meshCorrection.setZ(face.centroid.z - this.radius - 0.2);
            }

            break;
          }
        }
		  } // end loop over faces
    } // end else for walls/floors/ceilings
  }

  var collidable = null;
  if (intersectedObjs.length > 0) { // at least one intersection
    collidable = {
        obj: intersectedObjs[0], // TODO
        vector: correctedVec,
        meshCorrection : meshCorrection
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
  var originalPosition = this.position.clone();

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

    // hack shit together
    // If collided with wall, set position to be at edge of wall
    if (collision.meshCorrection.x != 0) {
      this.position.setX(collision.meshCorrection.x);
    }
    if (collision.meshCorrection.y != 0) {
      this.position.setY(collision.meshCorrection.y);
    }
    if (collision.meshCorrection.z != 0) {
      this.position.setZ(collision.meshCorrection.z);
    }
	}
	else {
		// TODO before or after changing velocity?
		this.position.add(this.velocity);

		// reset forces, because all of these have been applied
		this.force.set(0, 0, 0, 0);
	}
    
    //this.mesh.position.copy(this.position); // update mesh position as well
    this.mesh.matrixWorld.makeTranslation(this.position.x,
        this.position.y - this.radius,
        this.position.z);

    // Check if movable changed positions
    if (! originalPosition.equals(this.position)) {
      this.moved = true;
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
