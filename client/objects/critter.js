/**
 * Client side representation of a critter.
 */

/**
 * Creates an instance of a critter.
 */
var Critter = function(critterObj) {
  this.id = critterObj.id;

  this.hp = 30;

  this.position = new THREE.Vector4().copy(critterObj.position);
  this.orientation = new THREE.Vector4().copy(critterObj.orientation);
  this.state = critterObj.state;
  this.model = critterObj.model;

  this.type = types.CRITTER;

	this.mesh = models.critters[this.model][0].clone();

	// necessary for graphics
  this.scale = critterObj.scale;
  this.radius = critterObj.radius;
	this.mesh.position.copy(this.position);
  this.mesh.position.setY(this.position.y - this.radius);

  // Don't add to scene in constructor. Called in WorldState's addCritter().
};

Critter.prototype.updateHP = function(hp) {
  this.hp = hp;
  var mesh_scale = Math.max(0.01 * this.hp, 0.08);
  this.mesh.scale.set(mesh_scale, mesh_scale, mesh_scale);
};
