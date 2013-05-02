/**
 * server/logic/gameEventsHandler.js
 *
 * @fileoverview Handle large game events (player join, player leave, round start,
 * round end, etc..)
 * @author Trevor Pottinger
 */

var util = require('util'),
	 events = require('events');

var START_GAME_DELAY = 10 * 1000; // 10 seconds

function Handler() {

	this.on('newgame', function() {
		setTimeout(startRound, START_GAME_DELAY);
	});

	this.on('newplayer', function() {
	});

	this.on('delplayer', function() {
	});

}

util.inherits(Handler, events.EventEmitter);

function startRound() {
}

module.exports = Handler;
