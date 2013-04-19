/**
*@constructor
**/
function Border(center,up,vertexShader,fragmentShader)
{
	this.up = up;
	this.center = center;
	this.passedGeometry = false;
	this.geometry = new THREE.Geometry();

	this.length = 150;
	this.pointCount = 0;

	//shader materials and particle system
	this.attributes = null;
	this.uniforms = null;
	this.particleSystem = null;
	this.shaderMaterial = null;

	this.vertexShader = vertexShader;
	this.fragmentShader = fragmentShader;

	this.trailPosition = 0;
	this.trailCount = 10;

	this.init();
}

Border.prototype.generateSquare = function()
{
	var value = this.length/2;
	var y = this.center.y;
	//bottom
	for(i= -value ;i<value;i+=2)
	{
		var x = i;
		var particle = new THREE.Vector3(x,y,value);
		this.geometry.vertices.push(particle);
	}
	//right
	for(i= value;i>= -value;i-=2)
	{
		var z = i;
		var particle = new THREE.Vector3(value,y,z);
		this.geometry.vertices.push(particle);
	}
	//top
	for(i=value;i>=-value;i-=2)
	{
		var x = i;
		var particle = new THREE.Vector3(x,y,-value);
		this.geometry.vertices.push(particle);
	}
	//left
	for(i=-value;i<value;i+=2)
	{
		var z = i;
		var particle = new THREE.Vector3(-value,y,z);
		this.geometry.vertices.push(particle);
	}

	this.pointCount = this.geometry.vertices.length;
}

Border.prototype.addToScene = function(scene)
{
	scene.add(this.particleSystem);
};

Border.prototype.initValues = function()
{
	for(i=0;i<this.pointCount;i++)
	{
		this.attributes.isParticleLit.value[i] = 0;
		this.attributes.weightValue.value[i] = 0;
	}
}



Border.prototype.init = function()
{
	this.uniforms = {
		color: {type: 'c', value: new THREE.Color(0xfffff)},
		normals: {type: 'v3', value:this.up}
	};

	this.attributes = {
		isParticleLit: {type: 'f', value: []},
		weightValue: {type: 'f', value: []}
	};

	this.shaderMaterial = new THREE.ShaderMaterial({
		uniforms: this.uniforms,
		attributes: this.attributes,
		vertexShader : this.vertexShader,
		fragmentShader : this.fragmentShader,
		transparent: true
	});

	this.generateSquare();
	this.initValues();

	this.particleSystem = new THREE.ParticleSystem(this.geometry,this.shaderMaterial);
}


Border.prototype.updateAttributes = function()
{
	if(this.trailPosition != 0)
		this.attributes.isParticleLit.value[this.trailPosition-60] = 0;

	if(this.trailPosition == this.pointCount+1)
	{
		this.attributes.isParticleLit.value[this.trailPosition-1] = 0;
		this.trailPosition = 0;
	}

	for(i = 0; i < 60; i++)
	{
		if(this.attributes.isParticleLit.value[this.trailPosition-i] <= 60)
			this.attributes.isParticleLit.value[this.trailPosition-i] += .3;
		else
			this.attributes.isParticleLit.value[this.trailPosition-i] = 0;
	}
	

	//this.attributes.isParticleLit.value[this.trailPosition] = 1;


	//this.attributes.weightValue.value[this.trailPosition] += 0.1 ;
	/*
	for(i=0;i<this.trailCount;i++)
	{
		var nBheind = this.attributes.weightValue.value[this.trailPosition-i];
		if(nBheind >= 1.0)
			nBheind = 0;
		this.attributes.weightValue.value[this.trailPosition-i] += 0.05;
	}
	*/

	//set update flag
	this.attributes.isParticleLit.needsUpdate = true;
	this.attributes.weightValue.needsUpdate = true;

	++this.trailPosition;
}

Border.prototype.update = function()
{
	this.updateAttributes();
}
