/**
 * @fileoverview Functions to handle events coming from the client.
 *    contains buffer of client events.
 * @author Jennifer Fang
 * @author Rohan Halliyal
 */

// Include modules
var EventEmitter = require('events').EventEmitter;
var util = require('util');

// TODO move to server config file
var BUFFER_SIZE = 1000000000; // 1 billion bytes

/**
 * Creates the buffer for client events.
 * @constructor
 */
var EventBuffer = function() {
  this.buffer = new Buffer(BUFFER_SIZE);
  this.nextEmptyIndex = 0;
  this.sizeOfEvent = 0; // this is janky...
};

/**
 * Adds an event to the end of the events buffer.
 * @param {string | ArrayBuffer} data The data from a client.
 */
EventBuffer.prototype.addEvent = function(data) {
  this.buffer.write(data, this.nextEmptyIndex, data.length, 0);
  this.nextEmptyIndex += data.length; // TODO if not strings, want bytes
  this.sizeOfEvent = data.length; // TODO: change this...
  var retVal = this.buffer.toString(0, 0, this.nextEmptyIndex);
};

/**
 * Flushes the buffer and returns as a string.
 * @return {string} the buffer of events as a string.
 */
EventBuffer.prototype.flushAsString = function() {
    var retVal = this.buffer.toString(0, 0, this.nextEmptyIndex);
    this.nextEmptyIndex = 0; // resets buffer for writing new events
    return retVal;
};

exports.EventBuffer = EventBuffer;
//util.inherits(ClientEventHandler, EventEmitter);
