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

	var mesh = models.critter[this.model];
	this.mesh = new THREE.Mesh(mesh.geometry, mesh.material);

  // Don't add to scene in constructor. Called in WorldState's addPlayer().
};
