/**
 * random.js
 *
 * @fileoverview Return random, friendly strings
 * @author Trevor Pottinger
 */

var THREE = require('three');
var crypto = require('crypto');

var ncalls = 0;

/**
 * Returns a random, URL-friendly string of specified length
 */
function random(length) {
	// generate a random url
	var sha = crypto.createHash('sha256'); // hash factory
	sha.update(ncalls.toString() + Date.now(), 'utf8'); // feed the factory
	var str = sha.digest('base64') // read and lock factory
		.slice(0,length)			// make shorter
		.replace(/\+/g, "-")	// replace non-url friendly characters
		.replace(/\//g, "_")
		.replace(/=/g, ",");

	ncalls++;
	return str;
}

/**
 * Returns a random position (three.Vec4)
 */
function randomPosition() {
	return new THREE.Vector4(
			Math.floor(Math.random() * 100 - 50),
			4, 
			Math.floor(Math.random() * 100 - 50),
			1
			);
}

module.exports = random;
module.exports.randomPosition = randomPosition;
