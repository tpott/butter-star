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
    this.name = "";

    this.position = new THREE.Vector4().copy(playerObj.position);
    this.orientation = new THREE.Vector4().copy(playerObj.orientation);
	 this.state = playerObj.state;
	 this.model = playerObj.model;

	 // defined in client/objects/worldstate.js
	 this.type = types.PLAYER; 

	 // defined in client/net/loader.js
	 this.mesh = models.players[this.model][0].clone();

	 // necessary for graphics
	this.scale = playerObj.scale;
	this.radius = playerObj.radius;
	this.mesh.position.copy(this.position);
	this.mesh.position.setY(this.position.y - this.radius);
	
	 // needed for vacuum effect
	this.vacuum = null;

	this.animation = null;

	this.killCount = 0;
	this.charge = 100;

	 // TODO remove 
	this.vacTrans = new THREE.Vector3(0,0,0);
    this.direction = null;
    this.isVacuum = false;
    this.vacAngleY = 0;
	this.plusOne = [];
	this.billboard = [];
	this.pSprite = THREE.ImageUtils.loadTexture('plusone.png');
  // TODO this should be on the server side?
  this.updateVacuumCharge(100);
  this.updateKillCounter(0);
};

Player.prototype.setName = function(name) {
    this.name = name;
}

Player.prototype.setAnimate = function() {
	scene.remove(this.mesh);
	
	// mesh.children hack from javascript console twidling
	this.mesh = animations.critters[0][0].clone();
	this.animation = new Animation(this.mesh.children[1]);

	scene.add(this.mesh);
};

Player.prototype.setMesh = function(scene) {
    this.mesh = models.players[this.model][0].clone();
	  scene.add(this.mesh);
};

Player.prototype.isVacuuming = function() {
	return this.state & VACUUMING;
}

Player.prototype.startVacuuming = function() {
	var orientation3 = new THREE.Vector3().copy(this.orientation);
	var position = this.position.clone();
	var a = new THREE.Vector3(this.orientation.x,0,this.orientation.z);
	var b = new THREE.Vector3(0,1,0);
	var direction = a.cross(b);
	direction.normalize();
	direction = direction.multiplyScalar(1.05);
	var zProjection = this.orientation.clone();
	zProjection.multiplyScalar(1.5);
	var offset = zProjection.addVectors(zProjection,direction);
	offset.y += 0.5
	position = position.addVectors(position,offset);
	this.vacuum = new Vacuum(
			position,
			new THREE.Vector3(1,0,0),
			1000, // number of particles
			$('#vertexShader').text(),
			$('#fragmentShader').text()
			);

	// scene is a global defined in client/main.js
	this.vacuum.addToScene(scene);
    this.updateVacuum();
}

Player.prototype.updateVacuum = function() {
	// translation from where vacuuming began
	//cross orientation vector with (0,1,) to get "right" side of position
	var vacTrans = new THREE.Vector3().copy(this.position);
	var zProjection = this.orientation.clone();
	zProjection.multiplyScalar(1.5);
	//vacTrans.addVectors(vacTrans,zProjection);	
	//cross orientation with Y axis to find right and left vector then scale to offset	
	var a = new THREE.Vector3(this.orientation.x,0,this.orientation.z)
	var b = new THREE.Vector3(0,1,0);
	var direction = a.cross(b);
	direction.normalize();
	direction = direction.multiplyScalar(1.02);
	var vacTrans = this.position.clone();
	vacTrans.addVectors(vacTrans,direction);
	vacTrans.addVectors(vacTrans,zProjection);
	vacTrans.y += .5;	
	var preTrans = new THREE.Vector3();
	//var preTrans = zProjection.addVectors(zProjection,direction);
	//preTrans.y += 0.5;
	
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
	yAngle = yAngle * 180.0 / Math.PI;
	if(this.orientation.y > 0)
		yAngle = -yAngle;
	this.vacuum.update(vacTrans, preTrans, xDeg, yAngle);
}

Player.prototype.stopVacuuming = function() {
	// scene is a global defined in client/main.js
    if (this.vacuum != null) {
    	this.vacuum.removeFromScene(scene);
	    this.vacuum = null;
    }
}

Player.prototype.updateVacuumCharge = function(charge) {
	this.charge = charge;

	// using globals
	if (myPlayer != null && this.id == myPlayer.id) {
	  statusBox.updateVacuumCharge(charge);
	}
};

Player.prototype.updateKillCounter = function(count) {
	this.killCount = count;

	// using globals
	if (myPlayer != null && this.id == myPlayer.id) {
	  statusBox.updateKillCounter(count);
	}

	if (scoreBoard.showing()) {
		scoreBoard.update();
	}
};
Player.prototype.nameAnimation = function()
{
			
			//console.log("creating plus one texture");
			var geometry = new THREE.Geometry();
			geometry.vertices.push(new THREE.Vector3(this.position.x,this.position.y+1,this.position.z));	
		
            var canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
        
            var context = canvas.getContext('2d');
            context.fillStyle = "yellow";
            context.fillRect(0,0,100,100);
            context.font = "24pt Arial";
            context.fillText("SUP BETCH", 0, 0);
			
            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            
            var material = new THREE.MeshBasicMaterial( {map: texture, transparent: true } );
            var particle = new THREE.ParticleSystem(geometry,material);
			scene.add(particle);
			
};
Player.prototype.plusOneAnimation = function()
{
	for(id in this.plusOne)
	{
		//create billboard texture
		if(this.billboard[id] == null)
		{
			
			//console.log("creating plus one texture");
            critterDeathAudio.load();
            critterDeathAudio.play();
			var geometry = new THREE.Geometry();
			geometry.vertices.push(new THREE.Vector3(this.plusOne[id].x,this.plusOne[id].y+1,this.plusOne[id].z));	
			var material = new THREE.ParticleBasicMaterial(
			{
				size: 5,
				map: this.pSprite,
				transparent: true
			});
			var particle = new THREE.ParticleSystem(geometry,material);
			scene.add(particle);
			this.billboard[id] = particle;	
			
		}
		//update the billbaord texture
		this.billboard[id].position.y += 0.1;
		this.billboard[id].material.opacity -= 0.01;
		//remove from scene and data structure
		if(this.billboard[id].material.opacity <=0)
		{
			scene.remove(this.billboard[id]);
			delete this.billboard[id];
			delete this.plusOne[id];
		}
	}
};
