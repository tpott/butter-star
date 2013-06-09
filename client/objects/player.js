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
    this.animationTimer = 0;
    this.animationOffset = 0;

	this.killCount = 0;
	this.charge = 100;

	 // TODO remove 
	this.vacTrans = new THREE.Vector3(0,0,0);
    this.direction = null;
    this.isVacuum = false;
    this.vacAngleY = 0;
	this.plusOne = [];
	this.critterID = [];
	this.billboard = [];
	this.critters = [];
	this.critterHP = [];
	this.numbers = [];
	
	//this.pSprite = THREE.ImageUtils.loadTexture('plusone.png');
	//this.mSprite = THREE.ImageUtils.loadTexture('minusone.png');
	this.initTextures();  
// TODO this should be on the server side?
  this.updateVacuumCharge(100);
  this.updateKillCounter(0);

    // for nametag
    this.nametag = {
        hasChanged: false,
        name: "",
        particle: null,
        context: null,
        canvas: null,
        texture: null,
        material: null
    };
    //this.nameAnimation();
};

Player.prototype.setName = function(name) {
    this.nametag.hasChanged = true;
    this.nametag.name = name;
	if (scoreBoard.showing()) {
		scoreBoard.update();
	}
}

Player.prototype.initTextures = function()
{
	
	this.pSprite = THREE.ImageUtils.loadTexture('plusone.png');
	this.mSprite = THREE.ImageUtils.loadTexture('minusone.png');
	this.numbers[0] = THREE.ImageUtils.loadTexture('zero.png');
	this.numbers[1] = THREE.ImageUtils.loadTexture('one.png');
	this.numbers[2] = THREE.ImageUtils.loadTexture('two.png');
	this.numbers[3] = THREE.ImageUtils.loadTexture('three.png');
	this.numbers[4] = THREE.ImageUtils.loadTexture('four.png');
	this.numbers[5] = THREE.ImageUtils.loadTexture('five.png');
	this.numbers[6] = THREE.ImageUtils.loadTexture('six.png');
	this.numbers[7] = THREE.ImageUtils.loadTexture('seven.png');
	this.numbers[8] = THREE.ImageUtils.loadTexture('eight.png');
	this.numbers[9] = THREE.ImageUtils.loadTexture('nine.png');
	this.numbers[10] = THREE.ImageUtils.loadTexture('zero_left.png');
	this.numbers[11] = THREE.ImageUtils.loadTexture('one_left.png');
	this.numbers[12] = THREE.ImageUtils.loadTexture('two_left.png');
	this.numbers[13] = THREE.ImageUtils.loadTexture('three_left.png');
	this.numbers[14] = THREE.ImageUtils.loadTexture('four_left.png');
	this.numbers[15] = THREE.ImageUtils.loadTexture('five_left.png');
};

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
    this.animationTimer+=1;
    this.animationOffset = Math.sin(this.animationTimer) / 30;
    this.mesh.position.addScalar(this.animationOffset);
    //this.mesh.position.copy(this.position.copy().addScalar(this.animationOffset));
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
        this.animationTimer = 0;
        this.mesh.position.copy(this.position);
        this.mesh.position.y = 0;
        //this.mesh.position = this.position.copy().addScalar(-this.animationOffset);
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
    
Player.prototype.updateNameLocation = function () {
    //console.log(this.nametagParticle.geometry.vertices);
    if (this.nametag.hasChanged) {
        scene.remove(this.nametag.particle);
        this.nametag.context.clearRect(0,0,this.nametag.canvas.width, this.nametag.canvas.height);
        this.nametag.context.fillText(this.nametag.name, this.nametag.canvas.width/2, this.nametag.canvas.height/2);
        
        this.nametag.texture = new THREE.Texture(this.nametag.canvas);
        this.nametag.texture.needsUpdate = true;
        
        this.nametag.material = new THREE.ParticleBasicMaterial( 
        {
            map: this.nametag.texture, 
            size: 5,
            transparent: true 
        });
        this.nametag.particle = new THREE.ParticleSystem(this.nametag.geometry,this.nametag.material);
        this.nametag.hasChanged = false;
        this.nametag.particle.geometry.verticesNeedUpdate = true;

        scene.add(this.nametag.particle);
    } else {
        this.nametag.particle.geometry.vertices[0].set(this.position.x, this.position.y+3.5, this.position.z);
        this.nametag.particle.geometry.verticesNeedUpdate = true;
    }
}
Player.prototype.nameAnimation = function()
{
			
			//console.log("creating plus one texture");
			this.nametag.geometry = new THREE.Geometry();
			this.nametag.geometry.vertices.push(
                new THREE.Vector3(this.position.x,this.position.y+3.5,this.position.z));	
		
            this.nametag.canvas = document.createElement('canvas');
            this.nametag.canvas.width = 100;
            this.nametag.canvas.height = 100;
        
            this.nametag.context = this.nametag.canvas.getContext('2d');
            this.nametag.context.textAlign = "center";
            this.nametag.context.textBaseline = "middle";
            this.nametag.context.fillStyle = "black";
            this.nametag.context.font = "18pt Dustismo Bold";
            this.nametag.context.fillText(this.nametag.name, this.nametag.canvas.width/2, this.nametag.canvas.height/2);
			
            this.nametag.texture = new THREE.Texture(this.nametag.canvas);
            this.nametag.texture.needsUpdate = true;
            
            this.nametag.material = new THREE.ParticleBasicMaterial( 
            {
                map: this.nametag.texture, 
                size: 5,
                transparent: true 
            });
            this.nametag.particle = new THREE.ParticleSystem(this.nametag.geometry,this.nametag.material);
			scene.add(this.nametag.particle);
			
};
Player.prototype.plusOneAnimation = function()
{
	for(id in this.plusOne)
	{
		//create billboard texture
		if(this.billboard[id] == null)
		{
			
			//console.log("creating plus one texture");
            if (!mute) {
                critterDeathAudio.load();
                critterDeathAudio.play();
            }
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
			delete this.critterID[id];
			delete this.plusOne[id];
			
		}
		if(this.critterID[id] == null)
		{
			this.critterID[id] = true;
			if(this.critterHP[id] != null)
			{
				scene.remove(this.critterHP[id].single);
				scene.remove(this.critterHP[id].tens);
				delete this.critterHP[id];
				delete this.critters[id];
			}
		}
	}
};
Player.prototype.critterHealth = function(critters)
{
	
	for(id in critters)
	{
		//init critter table
		if(this.critters[id] == null)
		{
			
			this.critters[id] = critters[id].hp;
			var position = critters[id].position.clone();
			position.y += 3;
			var geometry = new THREE.Geometry();
			geometry.vertices.push(position);
			var material = new THREE.ParticleBasicMaterial(
			{
				size: 2,
				map: this.numbers[0],
				transparent: true
			});
			var particle = new THREE.ParticleSystem(geometry,material);
			scene.add(particle);


			var position = critters[id].position.clone();
			position.y += 3;
			var geometry = new THREE.Geometry();
			geometry.vertices.push(position);
			var material = new THREE.ParticleBasicMaterial(
			{
				size: 2,
				map: this.numbers[12],
				transparent: true
			});
			var particle2 = new THREE.ParticleSystem(geometry,material);
			scene.add(particle2);
			this.critterHP[id] = {tens: particle2 , single: particle};	
			continue;
		}
		//update position 
		if(this.critters[id] == critters[id].hp)
		{	
			var position = critters[id].position.clone();
			position.y += 3;
			this.critterHP[id].single.geometry.vertices[0] = position;
			this.critterHP[id].tens.geometry.vertices[0] = position;
			this.critterHP[id].single.geometry.verticesNeedUpdate = true;	
			this.critterHP[id].tens.geometry.verticesNeedUpdate = true;
			continue;
		}
		else
		{
			//show hp and update hp	
			this.critters[id] = critters[id].hp;
			
			var value = this.critters[id] % 10;
			this.critterHP[id].single.material.map = this.numbers[value];
			
			var tens = Math.floor(this.critters[id] / 10);
			this.critterHP[id].tens.material.map = this.numbers[10+tens];	
			
		}
	}
	
};
