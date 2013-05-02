
//constructor


function Poof(center,direction,vertexShader,fragmentShader)
{
	this.direction = direction.clone().normalize();
	this.center = center;
	this.vertexShader = vertexShader;
	this.fragmentShader = fragmentShader;


	//shader materials, attributes and uniforms
	this.shaderMaterial = null;
	this.particleSystem = null;
	this.attributes = null;
	this.uniforms = null;

	this.numParticles = 100;
	this.geometry = new THREE.Geometry();

	this.weight = 0.0;

	this.init();
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
Poof.prototype.genereateEndPoints = function()
{
	var angle = 0.0;
	var inc = 360/this.numParticles;
	var radius = 10;
	for(i=0;i<this.numParticles;i++)
	{
		angle += inc;
		endPoint = generateCirclePoints(this.direction,this.center,radius,angle);
		this.attributes.endPoint.value[i] = endPoint;  
	}
};

Poof.prototype.generateParticles = function()
{
	for(i=0;i<this.numParticles;i++)
	{
		particle = this.center.clone();
		this.geometry.vertices.push(particle);
	}
};

Poof.prototype.addToScene = function(scene)
{
	scene.add(this.particleSystem);
};

Poof.prototype.init = function()
{
	this.uniforms = {
		color: {type: 'c', value: new THREE.Color(0xfffff)},
		weight: {type: 'f', value:this.weight}
	};
	this.attributes = {
		endPoint: {type: 'v3', value: []}
	};

	this.shaderMaterial = new THREE.ShaderMaterial({
		uniforms: this.uniforms,
		attributes: this.attributes,
		vertexShader : this.vertexShader,
		fragmentShader : this.fragmentShader,
		transparent: true
	});

	this.generateParticles();
	this.genereateEndPoints();

	this.particleSystem = new THREE.ParticleSystem(this.geometry, this.shaderMaterial);
};

Poof.prototype.update = function()
{
	this.uniforms.weight.value += 0.015;
	if(this.uniforms.weight.value >= 1.0)
		this.uniforms.weight.value = 0.0;

	this.uniforms.weight.needsUpdate = true;
};