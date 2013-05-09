/**
 * client/controls/keyboard.js
 *
 * client/main.js defines the object 'keyPresses'
 *
 * @fileoverview Handles keyboard events, while the game is being played
 * @author Thinh
 * @author Trevor
 */

// these should just be ascii character values
var keymap = {
	'ENTER' : 13,
	'LSHFT' : 16,
	'RSHFT' : 16,
	'LCTRL' : 17,
	'LALT' : 18,
	'ESC' : 27,
	'SPACE' : 32,
	'LARRW' : 37, 'UARRW' : 38, 'RARRW' : 39, 'DARRW' : 40,
	'0' : 48, '1' : 49, '2' : 50, '3' : 51, '4' : 52,
	'5' : 53, '6' : 54, '7' : 55, '8' : 56, '9' : 57,
	'a' : 65, 'b' : 66, 'c' : 67, 'd' : 68,
	'e' : 69, 'f' : 70, 'g' : 71, 'h' : 72,
	'i' : 73, 'j' : 74, 'k' : 75, 'l' : 76,
	'm' : 77, 'n' : 78, 'o' : 79, 'p' : 80,
	'q' : 81, 'r' : 82, 's' : 83, 't' : 84,
	'u' : 85, 'v' : 86, 'w' : 87, 'x' : 88,
	'y' : 89, 'z' : 90,
	'=' : 187,
	'-' : 189,
	'[' : 219,
	']' : 221,
};

// these are the chars that will get sent to the server
var codemap = {
	13 : 'ENTER',
	16 : 'SHFT',
	17 : 'LCTRL',
	18 : 'LALT',
	27 : 'ESC',
	32 : 'SPACE',
	37 : 'LARRW', 38 : 'UARRW', 39 : 'RARRW', 40 : 'DARRW',
	48 : '0', 49 : '1', 50 : '2', 51 : '3', 52 : '4',
	53 : '5', 54 : '6', 55 : '7', 56 : '8', 57 : '9',
	65 : 'a', 66 : 'b', 67 : 'c', 68 : 'd',
	69 : 'e', 70 : 'f', 71 : 'g', 72 : 'h',
	73 : 'i', 74 : 'j', 75 : 'k', 76 : 'l',
	77 : 'm', 78 : 'n', 79 : 'o', 80 : 'p',
	81 : 'q', 82 : 'r', 83 : 's', 84 : 't',
	85 : 'u', 86 : 'v', 87 : 'w', 88 : 'x',
	89 : 'y', 90 : 'z',
	187 : '=',
	189 : '-',
	219 : '[',
	221 : ']',
};

/*
 * check for key pressed from the player
 */
function keyDown(e){
	/*if(e.shiftKey == 1) {
		controlsEvent.set("sprinting", true);
	}
	if(e.shiftKey == 0) {
		controlsEvent.set("sprinting", false);
	}*/
	
	// client loop back functionality
	switch(e.keyCode) {
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
		case keymap['w']:
			controlsEvent.set("front", true);
			controlsEvent.set("Backwards", false);
            controlsEvent.set("moving", true);
			break;
		case keymap['a']:
			controlsEvent.set("left", true);
			controlsEvent.set("right", false);
            controlsEvent.set("moving", true);
			break;
		case keymap['s']:
			controlsEvent.set("Backwards", true);
			controlsEvent.set("front", false);
            controlsEvent.set("moving", true);
			break;
		case keymap['d']:
			controlsEvent.set("right", true);
			controlsEvent.set("left", false);
            controlsEvent.set("moving", true);
			break;
		default:
            //console.log(e.keyCode);
				break;
	}

	// append these to keyPresses
	keyPresses.push(codemap[e.keyCode]);
	//console.log("Key down: %s", codemap[e.keyCode]);
}

function keyUp(e){
	//console.log("Key UP! keyPresses=" + keyPresses);
	/*if(e.shiftKey == 1) {
		controlsEvent.set("sprinting", false);
	}
	if(e.shiftKey == 0) {
		controlsEvent.set("sprinting", false);
	}*/

	// client loop back functionality
	switch(e.keyCode) {
		case keymap['m']:
			 audio.pause();
			 break;
		case keymap['ESC']:
			optionMenu.toggle();
			break;
		case keymap['f']:
			toggleFullScreen();
			//handleFullscreen();
			break;
		/*case keymap['c']:
			myPlayer.vacuum.removeFromScene(scene);
			myPlayer.vacuum = null;
			controlsEvent.set("isVacuum", false);
			break;*/
		/*case keymap['w']:
			controlsEvent.set("front", false);
			break;
		case keymap['a']:
			controlsEvent.set("left", false);
			break;
		case keymap['s']:
			controlsEvent.set("Backwards", false);
			break;
		case keymap['d']:
			controlsEvent.set("right", false);
			break;*/
		//default:
			//console.log(e.keyCode);
	}

	// remove keys from keyPresses?
	/*if (!(delete keyPresses[codemap[e.keyCode]])) {
		console.log("Key up event without a key down event");
	}*/
	/*if(!controlsEvent.front && !controlsEvent.Backwards && 
       !controlsEvent.left && !controlsEvent.right) {
		controlsEvent.set("moving", false);
	}*/
}
