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
	'TOGGLE_VACCUM' : 5
};

// TODO use client settings
var keymap = {
	'w' : 'MOVE_FORWARD', 
	'a' : 'MOVE_LEFT', 
	's' : 'MOVE_BACKWARD', 
	'd' : 'MOVE_RIGHT',
	'c' : 'TOGGLE_VACCUM' 
};

// these keys don't need to be processed by the server, but
// will handle events that only need to take place on the client
var clientOnly = {
	'ESC' : 'TOGGLE_OPTIONMENU',
	'm' : 'TOGGLE_MUSIC', 
	'f' : 'TOGGLE_FULLSCREEN'
};

var unusedKeys = {
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

function Handler() {
}

/**
 * Takes in a single keyPress and should return the movement event
 */
Handler.prototype.parse = function(keyPress) {
	// keys that the server needs to handle
	if (keyPress in keymap) {
		return keymap[keyPress];
	}

	// keys that only the client needs
	else if (keyPress in clientOnly) {
		console.log("'%s' only used in client", keyPress);
		return null;
	}

	// keys the client recognizes but doesnt use
	else if (keyPress in unusedKeys) {
		console.log("'%s' is an unused key", keyPress);
		return null;
	}

	// a completely unrecognized key...
	else {
		console.log("'%s' is an UNKNOWN key", keyPress);
		return null;
	}
}

function isMoveEvent(evtName) {
	var evtEnum = EVENTS[evtName];
	return evtEnum == EVENTS['MOVE_FORWARD'] ||
		evtEnum == EVENTS['MOVE_BACKWARD'] || 
		evtEnum == EVENTS['MOVE_LEFT'] ||
		evtEnum == EVENTS['MOVE_RIGHT'];
}

/*
 * check for key pressed from the player
 */
function keyDown(e){
	// client loop back functionality
		/*case keymap['c']:
			if(myPlayer.vacuum == null) {
				myPlayer.vacuum = 
                    new Vacuum(new THREE.Vector3(
                                    myPlayer.position.x,
                                    myPlayer.position.y,
                                    myPlayer.position.z), 
                               new THREE.Vector3(0,0,-1), 
                               1000, 
										 $('#vertexShader').text(),
										 $('#fragmentShader').text());
				myPlayer.vacuum.update(myPlayer.vacTrans,controlsEvent.angle);
				myPlayer.vacuum.addToScene(scene);
			}
			controlsEvent.set("isVacuum", true);
			break;*/
}

function keyUp(e){
	// client loop back functionality
		/*case keymap['c']:
			myPlayer.vacuum.removeFromScene(scene);
			myPlayer.vacuum = null;
			controlsEvent.set("isVacuum", false);
			break;*/
}

module.exports = EVENTS;
module.exports.isMoveEvent = isMoveEvent;
module.exports.Handler = Handler;
