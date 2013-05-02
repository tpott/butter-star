/**
 * client/controls/keyboard.js
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
	'[' : 219,
	']' : 221,
	'-' : 189,
	'=' : 187,
};

/*
 * check for key pressed from the player
 */
function keyDown(e){
	if(e.shiftKey == 1) {
		controlsEvent.set("sprinting", true);
	}
	if(e.shiftKey == 0) {
		controlsEvent.set("sprinting", false);
	}
	switch(e.keyCode) {
		case keymap['m']:
             audio.pause();
			 break;
		case keymap['c']:
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
			break;
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
            console.log(e.keyCode);
				break;
	}
}

function keyUp(e){
	if(e.shiftKey == 1) {
		controlsEvent.set("sprinting", false);
	}
	if(e.shiftKey == 0) {
		controlsEvent.set("sprinting", false);
	}
	switch(e.keyCode) {
		case keymap['ESC']:
			optionMenu.toggle();
			break;
		case keymap['f']:
			toggleFullScreen();
			//handleFullscreen();
			break;
		case keymap['c']:
			myPlayer.vacuum.removeFromScene(scene);
			myPlayer.vacuum = null;
			controlsEvent.set("isVacuum", false);
			break;
		case keymap['w']:
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
			break;
		default:
			//console.log(e.keyCode);
	}

	if(!controlsEvent.front && !controlsEvent.Backwards && 
       !controlsEvent.left && !controlsEvent.right) {
		controlsEvent.set("moving", false);
	}
}
