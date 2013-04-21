/**
*
*@constructor
*@this {Vacuum}
*@param{Vector3} base is the convergence point of the vacuum
*@param{Vector3} direction the vacuum will be pointing
*@param{number} number of particles to generate
*
**/
function Vacuum(base,direction,numParticles,vertexShader, fragmentShader)
{
	this.base = base.clone();
	this.direction = direction.clone();
	this.numParticles = numParticles;
	this.currParticleCount = 0;
	this.isAllParticlesGenerated = false;
	this.geometry = new THREE.Geometry();
	this.angle = 0.0;
	this.vCenterCircle = new THREE.Vector3();
	this.length = 150;

	//shader attributes and uniforms
	this.uniforms = {};
	this.attributes = {};

	//particle system and shaders
	this.vertexShader = vertexShader;
	this.fragmentShader = fragmentShader;
	this.shaderMaterial;
	this.particleSystem;

	//transformations
	this.rotationMatrix = new THREE.Matrix4();
	this.translationMatrix = new THREE.Matrix4();
	this.negativeTranslationMatrix = new THREE.Matrix4();
	this.offsetMatrix = new THREE.Matrix4();
	this.offsetMatrix.identity();

	//uniform values
	this.weight = 0.0;;

	this.init();
}
/**
*@this {Vacuum}
*@param {numParticles} number of particles
**/
Vacuum.prototype.setNumParticles = function(numParticles) {
	this.numParticles = numParticles;
};

/**
*@this {Vacuum}
*@return {numParticles} returns the number of particles being generated
**/

Vacuum.prototype.getNumParticles = function()
{
	return this.numParticles;
};

/**
*@deprecated
*@this {Vacuum}
*@param {vertexShader} bind vertexShader to a vertexShader content
*
**/
Vacuum.prototype.setVertexShader = function(vertexShader)
{
	this.vertexShader = vertexShader;
};

/**
*@deprecated
*@this {Vacuum}
*@param {fragmentShader} bind fragmentShader to a fragmentShader content
**/
Vacuum.prototype.setFragmentShader = function(fragmentShader)
{
	this.fragmentShader = fragmentShader;
};

Vacuum.prototype.setDirection = function(direction)
{

};

/**
*@this {Vacuum}
*@param{vertexShader} bind vertex shader
*@param{fragmentShader} bind fragment shader
**/
Vacuum.prototype.setShaderMaterial = function()
{
//	this.vertexShader = vertexShader;
//	this.fragmentShader = fragmentShader;

	this.shaderMaterial = new THREE.ShaderMaterial({
		uniforms: this.uniforms,
		attributes: this.attributes,
		vertexShader : this.vertexShader,
		fragmentShader : this.fragmentShader
	});
};
/**
*@this {Vacuum}
*@param {scene} scene object to bind particle Systems to
**/
Vacuum.prototype.addToScene = function(scene)
{
	scene.add(this.particleSystem);
};

function isNegative(number)
{
	if(number < 0.0)
		return true;
	return false;
}

function createOrthoVector(positive,negative)
{
	var vector = [1,2,3];

	if(negative.length % 2 != 0)
	{
		if(negative.length == 1)
		{
			vector[negative[0].type] = -1/negative[0].value;
			vector[positive[0].type] = 1/positive[0].value;
			vector[positive[1].type] = 0.0;
		}
		else
		{
			vector[positive[0].type] = 0.0;
			vector[negative[0].type] = -1/negative[0].value;
			vector[negative[1].type] = 1/negative[0].value;
		}
	}
	else
	{
		if(negative.length == 2)
		{
			vector[positive[0].type] = 1/positive[0].value;
			vector[negative[0].type] = -1/negative[0].value;
			vector[negative[1].type] = 0.0;
		}
		else
		{
			vector[positive[0].type] = -1/positive[0].value;
			vector[positive[1].type] = 1/positive[1].value;
			vector[positive[2].type] = 0.0;
		}
	}

	return new THREE.Vector3(vector[0],vector[1],vector[2]);
}

function findOrthoVector(vector)
{
	var x,y,z,rand;
	rand = Math.random();
	var magnitude = Math.sqrt((vX*vX) + (vY*vY) + (vZ*vZ));
	var vX = vector.x;var vY = vector.y;var vZ = vector.z;

	var positive = [];
	var negative = [];
	var objX = {type: 0, value: vX};
	var objY = {type: 1, value: vY};
	var objZ = {type: 2, value: vZ};

	isNegative(vX) ? negative.push(objX) : positive.push(objX);
	isNegative(vY) ? negative.push(objY) : positive.push(objY);
	isNegative(vZ) ? negative.push(objZ) : positive.push(objZ);


	//if all three values are non zero
	if(vX != 0.0 && vY != 0.0 && vZ != 0.0)
 	{
 		return createOrthoVector(positive,negative);
	}

	vector.x == 0 ? x = rand: x = 0.0;
	vector.y == 0 ? y = rand: y = 0.0;
	vector.z == 0 ? z = rand: z = 0.0;
	return new THREE.Vector3(x,y,z).normalize();
}

function generateCirclePoints(direction,center,radius,angle)
{
	var vectorV = direction;
	var vectorA = findOrthoVector(direction);
	var vectorCross = vectorV.clone();
	var vectorB = vectorCross.crossVectors(vectorV, vectorA);

	var x = center.x + radius*Math.cos(angle)*vectorA.x + radius*Math.sin(angle)*vectorB.x;
   	var y = center.y + radius*Math.cos(angle)*vectorA.y + radius*Math.sin(angle)*vectorB.y;
   	var z = center.z + radius*Math.cos(angle)*vectorA.z + radius*Math.sin(angle)*vectorB.z;
   				
	return new THREE.Vector3(x,y,z);
}

Vacuum.prototype.generateRandomAttributeValues = function()
{
	for(i=0;i<this.numParticles;i++)
	{
		this.attributes.particleWeight.value[i] = Math.random();
		this.attributes.displacement.value[i] = Math.random() * 15 - 15;
	}
};
/*
Vacuum.prototype.generateParticleValues = function()
{
	var bounds = this.currParticleCount+10;
	var counter = 0;
	var radius = this.radius;
	for(i=this.currParticleCount;i<bounds;i++)
	{	
		if(counter >= 5)
		{
			radius = this.radius;
			counter = 0;
		}
		radius -= 2;
		this.angle += 0.1;
		counter++;
		var particle = generateCirclePoints(this.direction,this.vCenterCircle,this.radius,this.angle);
		this.geometry.vertices.push(particle);
		var vNormal = new THREE.Vector3();
		vNormal = vNormal.subVectors(particle,this.vCenterCircle);
		this.attributes.normals.value[i] = vNormal.normalize();
		this.currParticleCount++;
	}
	if(this.currParticleCount == this.numParticles)
		this.isAllParticlesGenerated = true;
};
*/

Vacuum.prototype.generateAllParticles = function()
{
	var radius = 40;
	var counter = 0;
	var angle = 0.0;
	for(i=0; i < this.numParticles; i++)
	{
		if(counter >= 10)
		{
			radius = 40;
			counter = 0;
		}
		radius -= 2;
		angle += 0.1;
		counter++;
		particle = generateCirclePoints(this.direction,this.vCenterCircle,radius,angle);
		this.geometry.vertices.push(particle);
		var vNormal = new THREE.Vector3();
		vNormal = vNormal.subVectors(particle,this.vCenterCircle);
		this.attributes.normals.value[i] = vNormal.normalize();
	}

};

Vacuum.prototype.init = function()
{
	//calcualte the position of the center of the circle
	var projection = this.direction.clone().normalize();
	this.vCenterCircle = this.vCenterCircle.addVectors(this.base, projection.multiplyScalar(this.length));

	//initialize values for matricies
	this.translationMatrix.makeTranslation(this.base.x,this.base.y,this.base.z);
	this.negativeTranslationMatrix.makeTranslation(-this.base.x, -this.base.y, -this.base.z);


	//initalize attributes and uniforms for shader
	this.uniforms = {
		color: {type: 'c', value: new THREE.Color(0xfffff)},
		rotation: {type: 'm4', value: this.rotationMatrix},
		weight: {type: 'f', value: this.weight},
		base: {type: 'v3', value: this.base},
		translation: {type: 'm4', value: this.translationMatrix},
		negativeTranslation: {type: 'm4', value: this.negativeTranslationMatrix},
		offset: {type: 'm4', value: this.offsetMatrix}
	};

	this.attributes = {
		particleWeight: {type:'f', value: []},
		displacement: {type: 'f', value: []},
		normals: {type: 'v3', value:[] }
	};

	this.shaderMaterial = new THREE.ShaderMaterial({
		uniforms: this.uniforms,
		attributes: this.attributes,
		vertexShader : this.vertexShader,
		fragmentShader : this.fragmentShader
	});
	//initialize attribute values with random values
	this.generateRandomAttributeValues();

	this.generateAllParticles();

	//create particle system
	this.particleSystem = new THREE.ParticleSystem(this.geometry, this.shaderMaterial);
	this.direction.normalize();

};

/**
*@this {Vacuum}
**/
Vacuum.prototype.update = function()
{	
	this.uniforms.rotation.value.makeRotationAxis(this.direction,this.angle);
	this.uniforms.weight.value += 0.005;

	if(this.uniforms.weight.value >= 1.0)
		this.uniforms.weight.value = 0.0;

	this.uniforms.weight.needsUpdate = true;

	this.angle += 0.15;
};