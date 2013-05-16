/**
 * random.js
 *
 * @fileoverview Return random, friendly strings
 * @author Trevor Pottinger
 */

var crypto = require('crypto');

/**
 * Returns a random, URL-friendly string of specified length
 */
function random(length) {
	// generate a random url
	var sha = crypto.createHash('sha256'); // hash factory
	sha.update('' + Date.now(), 'utf8'); // feed the factory
	var str = sha.digest('base64') // read and lock factory
		.slice(0,length)			// make shorter
		.replace(/\+/g, "-")	// replace non-url friendly characters
		.replace(/\//g, "_")
		.replace(/=/g, ",");

	return str;
}

module.exports = random;
