/**
 * server/controls/handler.js
 *
 * @overview Handles keyboard events, while the game is being played
 * @author Trevor
 */

// these get exported
var EVENTS = {
	'NONE' : 0,
	'MOVE_FORWARD' : 1,
	'MOVE_LEFT' : 2,
	'MOVE_BACKWARD' : 3,
	'MOVE_RIGHT' : 4,
	'VACUUM' : 5,
	'ROTATE' : 6
};

// TODO use client settings
var keymap = {
	'w' : 'MOVE_FORWARD', 
	'a' : 'MOVE_LEFT', 
	's' : 'MOVE_BACKWARD', 
	'd' : 'MOVE_RIGHT',
	'c' : 'VACUUM' 
};

// these keys don't need to be processed by the server, but
// will handle events that only need to take place on the client
var clientOnly = {
	'ESC' : 'TOGGLE_OPTIONMENU',
	'm' : 'TOGGLE_MUSIC', 
	'f' : 'TOGGLE_FULLSCREEN'
};

var unusedKeys = {
	'TAB' : 9,
	'ENTER' : 13,
	'LSHFT' : 16,
	'RSHFT' : 16,
	'LCTRL' : 17,
	'LALT' : 18,
	'SPACE' : 32,
	'LARRW' : 37, 'UARRW' : 38, 'RARRW' : 39, 'DARRW' : 40,
	'0' : 48, '1' : 49, '2' : 50, '3' : 51, '4' : 52,
	'5' : 53, '6' : 54, '7' : 55, '8' : 56, '9' : 57,
	'b' : 66, 
	'e' : 69, 'g' : 71, 'h' : 72,
	'i' : 73, 'j' : 74, 'k' : 75, 'l' : 76,
	'n' : 78, 'o' : 79, 'p' : 80,
	'q' : 81, 'r' : 82, 't' : 84,
	'u' : 85, 'v' : 86, 'x' : 88,
	'y' : 89, 'z' : 90,
	'=' : 187,
	'-' : 189,
	'[' : 219,
	']' : 221,
};

function Event(name, data) {
	this.name = name;
	this.data = data || null;

	var evtEnum = EVENTS[name];
	this._ismove = evtEnum == EVENTS['MOVE_FORWARD'] ||
		evtEnum == EVENTS['MOVE_BACKWARD'] || 
		evtEnum == EVENTS['MOVE_LEFT'] ||
		evtEnum == EVENTS['MOVE_RIGHT'];

	this._isrotate = evtEnum == EVENTS['ROTATE'];

	this._istogglevacuum = evtEnum == EVENTS['VACUUM'];
}

Event.prototype.isMoveEvent = function() {
	return this._ismove;
}

Event.prototype.isRotateEvent = function() {
	return this._isrotate;
}

Event.prototype.isToggleVacuum = function() {
	return this._istogglevacuum;
}

Event.prototype.isAState = function() {
	return this._ismove || this._istogglevacuum;
}

function Handler() {
}

/**
 * Takes in all the keyPresses and should return the movement events
 */
Handler.prototype.parse = function(keyPresses) {
	var events = [];

	for (var i = 0; i < keyPresses.length; i++) {
		// keys that the server needs to handle
		if (keyPresses[i] in keymap) {
			events.push(new Event(keymap[keyPresses[i]]));
		}

		// keys that only the client needs
		else if (keyPresses[i] in clientOnly) {
			//console.log("'%s' only used in client", keyPresses[i]);
		}

		// keys the client recognizes but doesnt use
		else if (keyPresses[i] in unusedKeys) {
			//console.log("'%s' is an unused key", keyPresses[i]);
		}

		// mouse rotate
		else if (keyPresses[i] instanceof Array) {
			//console.log("Rotate by %s.", keyPresses[i]);
			events.push(new Event('ROTATE', keyPresses[i]));
		}

		// a completely unrecognized key...
		else {
			console.log("'%s' is an UNKNOWN key", keyPresses[i]);
		}
	}

	return events;
}

/*function isMoveEvent(evtName) {
	var evtEnum = EVENTS[evtName];
	return evtEnum == EVENTS['MOVE_FORWARD'] ||
		evtEnum == EVENTS['MOVE_BACKWARD'] || 
		evtEnum == EVENTS['MOVE_LEFT'] ||
		evtEnum == EVENTS['MOVE_RIGHT'];
}*/

module.exports = EVENTS;
module.exports.Handler = Handler;
