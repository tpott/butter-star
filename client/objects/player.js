/**
 * client/object/player.js 
 *
 * NOT SERVERSIDE
 * @author Trevor
 */

// player states, also defined in server/objects/player.js
var STANDING_STILL = 0,
    MOVING_FORWARD = 1,
    MOVING_BACKWARD = 2,
    MOVING_LEFT = 4,
    MOVING_RIGHT = 8,
    VACUUMING = 16,
    JUMPING = 32;

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

	 // defined in client/net/loader.js
	 this.mesh = models.player[this.model].clone();

	 // necessary for graphics
	 this.mesh.position = this.position;

	 // needed for vacuum effect
	this.vacuum = null;

	 // TODO remove 
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

Player.prototype.isVacuuming = function() {
	return this.state & VACUUMING;
}

Player.prototype.startVacuuming = function() {
	var orientation3 = new THREE.Vector3().copy(this.orientation);
	this.vacuum = new Vacuum(
			this.position,
			new THREE.Vector3(1,0,0),
			1000, // number of particles
			$('#vertexShader').text(),
			$('#fragmentShader').text()
			);

	// scene is a global defined in client/main.js
	this.vacuum.addToScene(scene);
}

Player.prototype.updateVacuum = function() {
	// translation from where vacuuming began
	var vacTrans = new THREE.Vector3().copy(this.position);
    var xorigin = new THREE.Vector4(1,0,0,0);
	var xOrientation = new THREE.Vector4(this.orientation.x,0,this.orientation.z,0);
    var dotResult = xorigin.dot(xOrientation);
	var result = dotResult/(xorigin.length() * xOrientation.length());
    var xRad = Math.acos(result);
    var xDeg = xRad * 180.0 / Math.PI;
	//console.log("vacuum :"  + xDeg);
    if (this.orientation.z > 0) {
        xDeg = -xDeg;
    }
    //console.log("xDeg " + xDeg);

	// angle from positive x axis towards positive z axis
	var xzPlaneAngle = 0;

	var yAngle = 0;
	var yOrigin = new THREE.Vector4(1.0,0,0,0);
	var yOrientation = new THREE.Vector4(1.0,this.orientation.y,0,0);
	var yDotResult = yOrigin.dot(yOrientation);
	var yResult = yDotResult/(yOrigin.length() * yOrientation.length());
	yAngle = Math.acos(yResult);
//	console.log(yAngle);
	yAngle = yAngle * 180.0 / Math.PI;
	if(this.orientation.y > 0)
		yAngle = -yAngle;
	//console.log("yDeg " + yAngle);
	this.vacuum.update(vacTrans, xDeg, yAngle);
}

Player.prototype.stopVacuuming = function() {
	// scene is a global defined in client/main.js
	this.vacuum.removeFromScene(scene);
	this.vacuum = null;
}

