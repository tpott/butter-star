//values for linear interpolation
uniform vec3 base;
uniform float weight;
uniform float amplitude;
attribute float particleWeight;
attribute float displacement;
attribute vec3 normals;

//values for rotation
uniform mat4 rotation;
uniform mat4 translation;
uniform mat4 negativeTranslation;
uniform mat4 offset;
uniform mat4 offsetNegative;
uniform mat4 offsetRotationY;
  uniform mat4 offsetRotationX;
attribute float alpha;
varying float vAlpha;
varying vec3 vNormal;

//linear interpolation
vec3 lerp(vec3 start, vec3 end, float weight)
{
	return start*(1.0-weight) + end*(weight);
}

//calculate new position using linear interpolation with given weights
vec3 calcFinalPos()
{
	vec3 displace = position + normals * vec3(displacement);
	float newWeight = particleWeight + weight;
	if(newWeight >=1.0)
		newWeight -= 1.0;
	return lerp(displace,base,newWeight);
}
//set gl_Position to newly calculated position
void main()
{
	vAlpha = alpha;
	gl_PointSize = 1.0;
	vec4 newPosition = offset * translation * offsetRotationY
		 * offsetRotationX * rotation * negativeTranslation * vec4(calcFinalPos() ,1.);
	gl_Position = projectionMatrix * modelViewMatrix * newPosition;
}
