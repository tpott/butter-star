/**
 * client/object/player.js 
 *
 * NOT SERVERSIDE
 * @author Trevor
 */

/**
 * Player constructor, uses a player "skeleton" object from the server
 * that specifies which model to be used, initial position, orientation,
 * and state
 */
var Player = function(playerObj) {
	this.id = playerObj.id;

    this.position = new THREE.Vector4(
			 playerObj.position.x,
			 playerObj.position.y,
			 playerObj.position.z,
			 playerObj.position.w
		);
    this.orientation = new THREE.Vector4(
			 playerObj.orientation.x,
			 playerObj.orientation.y,
			 playerObj.orientation.z,
			 playerObj.orientation.w
		);
	 this.state = playerObj.state;
	 this.model = playerObj.model;

	 // defined in client/objects/worldstate.js
	 this.type = types.PLAYER; 

	 // copy the mesh
	 var mesh = models.player[this.model];
    this.mesh = new THREE.Mesh(mesh.geometry, mesh.material);

	 // TODO remove 
	this.vacuum = null;
	this.vacTrans = new THREE.Vector3(0,0,0);
    this.direction = null;
    this.isVacuum = false;
    this.vacAngleY = 0;

	 // TODO maybe remove
	/*this.model =
    {		
        objects : new THREE.Object3D(),
        motion  : 'stand',
        state   : 'stand'
    };*/
};

Player.prototype.setMesh = function(scene) {
    this.mesh = new THREE.Mesh(models.player[this.model].geometry,
			 models.players[this.model].material);
	  scene.add(this.mesh);
};
