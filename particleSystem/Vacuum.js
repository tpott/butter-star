



//variables
/**
*
*@constructor
*@this {Vacuum}
*@param{Vector3,Vector3,number} base is the endpoint of the vacuum, direction is the direction of the vacuum, number of particles
*
**/
function Vacuum(base,direction,numParticles)
{
	this.center = center;
	this.direction = direction;
	this.numParticles = numParticles;

	this.uniforms = {};
	this.attributes = {};

	this.vertexShader;
	this.fragmentShader;
}


/**
*
*@this {Vacuum}
*@param{Vector3} base vector in which 
*@return{Vector3} returns a Vector3 that is orthogonal to given vector
**/
Vacuum.prototype.findOrthoVector = function(vector)
{
	var x,y,z,rand;
	rand = Math.random();
	vector.x == 0 ? x = rand: x = 0.0;
	vector.y == 0 ? y = rand: y = 0.0;
	vector.z == 0 ? z = rand: y = 0.0;
	return new THREE.Vector3(x,y,z).normalize();
};
/**
*
*@this {Vacuum}
*@param {Vector3,Vector3,float,float} direction Vector, base Vector, radius, angle
*@return {Vector3} returns a point on a circle in 3D space given the direction and base
**/
Vacuum.prototype.generateCirclePoints = function(direction,center,radius,angle)
{
	var vectorV = direction;
	var vectorA = findOrthoVector(direction);
	var vectorCross = vectorV.clone();
	var vectorB = vectorCross.crossVectors(vectorV, vectorA);

	var x = center.x + radius*Math.cos(angle)*vectorA.x + radius*Math.sin(angle)*vectorB.x;
   	var y = center.y + radius*Math.cos(angle)*vectorA.y + radius*Math.sin(angle)*vectorB.y;
   	var z = center.z + radius*Math.cos(angle)*vectorA.z + radius*Math.sin(angle)*vectorB.z;
   				
	return new THREE.Vector3(x,y,z);
};

/**
*@this {Vacuum}
**/
Vacuum.prototype.init = function()
{};

/**
*@this {Vacuum}
**/
Vacuum.prototype.update = function()
{};