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
    this.buffPosWrite = 0;
    this.buffPosRead = 0;
    this.dataLengths = [];
    this.dataIndexRead = 0;
};

EventBuffer.prototype.getEventsAsArray = function() {
    var retVal = [];
    playerEventString = this.getNextEvent();
    do { 
        if (playerEventString == "") {
            return retVal;
        } else {
            var playerEvent = JSON.parse(playerEventString);
            if (playerEvent.playerID == -1) {
                //console.log("Someone fucked shit up");
            } else {
                retVal.push(playerEvent);
            }
        }
        playerEventString = this.getNextEvent();
    } while (playerEventString != "");

    return retVal;
}

/**
 *  Effectively a dequeue function grabbing the first element in the buffer.
 *  Expected use must be to pop all of the events off in a loop until no
 *  events are left, otherwise the EventBuffer will be left in an 
 *  inconsistent state.
 */
EventBuffer.prototype.getNextEvent = function() {
    if (this.dataIndexRead != 0 && this.dataLengths.length != 0){
    //console.log(this.dataIndexRead + " " + this.dataLengths.length);
    //console.log(this.dataIndexRead >= this.dataLengths.length);
    }
    if (this.dataIndexRead >= this.dataLengths.length) {
        // Reset everything because we have read all of the events from the
        // buffer
        this.dataIndexRead = 0;
        this.dataLengths = [];
        this.buffPosWrite = 0;
        this.buffPosRead = 0;
        return "";
    } else {
        var retString = this.buffer.toString(0,
            this.buffPosRead,
            this.buffPosRead+this.dataLengths[this.dataIndexRead]
        );

    
        //console.log(this.buffer.toString(0, 0, this.buffPosWrite));

        //console.log("dataIndexRead: " + this.dataIndexRead);
        //console.log("dataLengths: " + this.dataLengths + " length: " + this.dataLengths.length);
        //console.log("buffPosWrite: " + this.buffPosWrite);
        //console.log("buffPosRead: " + this.buffPosRead);
        this.buffPosRead += this.dataLengths[this.dataIndexRead];
        this.dataIndexRead++;
        return retString;
    }
}


/**
 * Adds an event to the end of the events buffer.
 * @param {string | ArrayBuffer} data The data from a client.
 */
EventBuffer.prototype.addEvent = function(data) {
  this.dataLengths.push(data.length);
  this.buffer.write(data, this.buffPosWrite, data.length, 0);
  this.buffPosWrite += data.length;
};

/**
 * Flushes the buffer and returns as a string.
 * @return {string} the buffer of events as a string.
 */
EventBuffer.prototype.flushAsString = function() {
    var retVal = this.buffer.toString(0, 0, this.buffPosWrite);
    // Reset everything because we have read all of the events from the
    // buffer
    this.dataIndexRead = 0;
    this.dataLengths = [];
    this.buffPosWrite = 0;
    this.buffPosRead = 0;
    return retVal;
};

exports.EventBuffer = EventBuffer;
//util.inherits(ClientEventHandler, EventEmitter);
