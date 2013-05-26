/**
 * client/objects/animate.js
 *
 * Provide animations for the client objects. Uses skinned meshes for 
 * the animating. 
 *
 * @author Trevor Pottinger
 */

function Animation(skin) {
	this.skin = skin;

	this.nframes = skin.morphTargetInfluences.length;
	this.lastFrame = 0;
	this.currentFrame = 0;
}

Animation.prototype.update = function() {
	// TODO time based calculation
	this.lastFrame = this.currentFrame;
	this.currentFrame = (this.lastFrame + 1) % this.nframes;

	this.skin.morphTargetInfluences[this.lastFrame] = 0;
	this.skin.morphTargetInfluences[this.currentFrame] = 1;
};
