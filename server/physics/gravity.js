/**
 * @fileoverview
 * @author Jennifer Fang
 */

// Get external functions
var THREE = require('three');

/**
 * Creates the ground in the game.
 * @constructor
 * @param {Game} game Game instance that this floor belongs to.
 */
function Gravity() {
  // TODO get passed from client? diff maps
  var geometry = new THREE.PlaneGeometry(200, 200, 100, 100);
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -10, 0));
  var material = new THREE.MeshBasicMaterial();
  this.floor = new THREE.Mesh(geometry, material);
};

/**
 * Apply gravity to the given object.
 * @param {Collidable} obj The object getting gravity applied to it.
 */
Gravity.prototype.applyGravity = function(obj) {
  var raycaster = new THREE.Raycaster();
  raycaster.ray.direction.set(0, -1, 0);
  raycaster.ray.origin.copy(obj.position.x, obj.position.y, obj.position.z);
  // raycaster.ray.origin.y -= 9.8; // TODO move to individual obj for diff grav

  var isOnGround = false;
  var intersections = raycaster.intersectObject(this.floor);
  console.log(JSON.stringify(intersections));
  if (intersections.length > 0) {
    console.log('GRAVITYYYY');
    var distance = intersections[0].distance;

    if(distance > 0 && distance < 10) {
      isOnGround = true;
    }
  }

  if(isOnGround === true) {
    obj.translate(0, -10, 0); // TODO fix later for objs of diff heights
  } else {
    console.log('falling but not really!');
    obj.translate(0, -1, 0);
  }
  obj.cube.matrixWorld.makeTranslation(
    obj.position.x, obj.position.y, obj.position.z);
  obj.game.addCollidable(obj.id, obj.cube);
};

module.exports = Gravity;
