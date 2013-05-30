/**
 * client/objects/environment.js
 *
 * Defines a possible environment
 * 
 * @author Trevor
 */

function Environment(jsonEnv) {
  this.id = jsonEnv.id;

  this.position = new THREE.Vector4().copy(jsonEnv.position);
  this.orientation = new THREE.Vector4().copy(jsonEnv.orientation);
  this.state = jsonEnv.state;
  this.model = jsonEnv.model;

  // defined in client/objects/worldstate.js
  this.type = types.ENVIRONMENT;

	this.mesh = models.environments[this.model][0].clone();
  this.mesh.position.copy(this.position);
  this.mesh.matrixWorld.makeTranslation(this.position.x,
      this.position.y,
      this.position.z);

  // Don't add to scene in constructor. Called in WorldState's addPlayer().
}

