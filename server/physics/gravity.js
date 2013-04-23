/**
 * @fileoverview
 * @author Jennifer Fang
 */

// Get external functions

// NOTE(jyfang): anything below this line is crap
function Gravity(obj) {
  this.obj = obj;
  this.isOnGround = false;

  // ground
  var geometry = new THREE.PlaneGeometry(200, 200, 100, 100);
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
};

Gravity.prototype.applyGravity = function(target, ground) {
  var raycaster = new THREE.Raycaster();
  raycaster.ray.direction.set(0, -1, 0);
  r
  var intersections = raycaster.intersectObject(ground);
  if (intersections.length > 0) {
    this.isOnGround = true;
  }
};
