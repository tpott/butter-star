/**
 * @fileoverview The class that encapsulates Vector4 information and holds
 * the underlying typed array representations.
 * @author Jennifer Fang
 * @author Trevor Pottinger
 */

/**
 * Constructs an Vector4 object with zeroed out typed array.
 * @constructor
 */
var Vector4 = function() {
  /**
   * The length of our vector.
   * @type {number}
   */
  this.length = 4;

  /**
   * The typed array we are using to hold our data.
   * @type {Float32Array}
   */
	this.array = new Float32Array(this.length);
  
  /**
   * The underlying ArrayBuffer representation.
   * @type {ArrayBuffer}
   */
  this.arrayBuffer = this.array.buffer;

  /**
   * The number of bytes in the vector.
   * @type {number}
   */
  this.byteLength = this.arrayBuffer.byteLength;
}

/**
 * The setter that also converts an ArrayBuffer to our typed buffer.
 * @param {ArrayBuffer} buffer The buffer holding our data to convert.
 */
Vector4.prototype.set = function (buffer) {
  // Change representation of our array
	var intarr = new Uint8Array(this.arrayBuffer);

  // Copy from ArrayBuffer byte by byte
	for (var i = 0; i < this.byteLength; i++) {
		intarr[i] = buffer[i];
	}
};

exports.Vector4 = Vector4;
