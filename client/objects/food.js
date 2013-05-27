/**
 * Client side representation of food.
 * @author Jennifer Fang
 */

/**
 * Creates an instance of food.
 */
var Food = function(foodObj) {
  this.id = foodObj.id;

  this.position = new THREE.Vector4().copy(foodObj.position);
  this.orientation = new THREE.Vector4().copy(foodObj.orientation);
  this.state = foodObj.state;
  this.model = foodObj.model;

  this.type = types.FOOD;

	this.mesh = models.foods[this.model].clone();

	// necessary for graphics
	this.mesh.position = this.position;

  // Don't add to scene in constructor. Called in WorldState's addFood().
};
