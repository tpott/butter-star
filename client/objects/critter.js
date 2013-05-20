/**
 * Client side representation of a critter.
 */

/**
 * Creates an instance of a critter.
 */
var Critter = function(critterObj) {
  this.id = critterObj.id;

  this.position = new THREE.Vector4(
      critterObj.position.x,
      critterObj.position.y,
      critterObj.position.z,
      critterObj.position.w
  );
  this.orientation = new THREE.Vector4(
      critterObj.orientation.x,
      critterObj.orientation.y,
      critterObj.orientation.z,
      critterObj.orientation.w
  );
  this.state = critterObj.state;
  this.model = critterObj.model;

  this.type = types.CRITTER;

  this.mesh = models.critters[this.model]; // TODO nothing in model.critters atm
  // Don't add to scene in constructor. Called in WorldState's addPlayer().
};
