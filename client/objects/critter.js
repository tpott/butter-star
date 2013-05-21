/**
 * Client side representation of a critter.
 */

/**
 * Creates an instance of a critter.
 */
var Critter = function(critterObj) {
  this.id = critterObj.id;

  this.position = new THREE.Vector4().copy(critterObj.position);
  this.orientation = new THREE.Vector4().copy(critterObj.orientation);
  this.state = critterObj.state;
  this.model = critterObj.model;

  this.type = types.CRITTER;

	this.mesh = models.critters[this.model].clone();

  // Don't add to scene in constructor. Called in WorldState's addPlayer().
};
