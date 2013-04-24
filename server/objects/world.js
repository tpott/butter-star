// Get external functions
var THREE = require('three');

function World(players, collidables) {

    this.collidables = collidables;
    this.players = players;
    this.critters = [];
    var geometry = new THREE.PlaneGeometry(200,200,1,1);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -10, 0));
    var material = new THREE.MeshBasicMaterial();
    this.floor = new THREE.Mesh(geometry, material);

}
World.prototype.applyGravityToAllObjects = function() {
    // applying to players 
    for (var id in this.players) {
        this.applyGravity(this.players[id]);
    }
}
World.prototype.applyGravity = function(obj) {
  var raycaster = new THREE.Raycaster();
  raycaster.ray.direction.set(0, -1, 0);
  raycaster.ray.origin.set(obj.position.x, obj.position.y, obj.position.z);
  // raycaster.ray.origin.y -= 9.8; // TODO move to individual obj for diff grav

    var isOnGround = false;
    var intersections = raycaster.intersectObjects([this.floor]);
    if (intersections.length > 0) {
        var distance = intersections[0].distance;
        if(distance > 0 && distance <= 1) {
          isOnGround = true;
        }
    }

    if(isOnGround === true) {
    // TODO fix later for objs of diff heights
    } else {
        obj.translate_(0, -1, 0);
    }
    obj.cube.matrixWorld.makeTranslation(
        obj.position.x, 
        obj.position.y, 
        obj.position.z
    );
    this.collidables[obj.id] = obj.cube;
};

module.exports = World;
