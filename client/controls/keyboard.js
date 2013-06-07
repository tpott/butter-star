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
	'TAB' : 9,
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
	9 : 'TAB', 
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

/**
 * Check if arrow key pressed and adds that to the mouse movement.
 */
var keyMoveXNeg = 0;
var keyMoveXPos = 0;
var keyMoveYNeg = 0;
var keyMoveYPos = 0;
var keyMoveRate = 0.10;
var keyMoveInitial = 2;
function keyMove() {
  if (keyPresses.indexOf('LARRW') != -1 || keyPresses.indexOf('j') != -1) {
    if (keyMoveXNeg == 0) { // initially move faster
      keyMoveXNeg -= keyMoveInitial;
    } else {
      keyMoveXNeg -= keyMoveRate;
    }
  }
  
  if (keyPresses.indexOf('UARRW') != -1 || keyPresses.indexOf('i') != -1) {
    if (keyMoveYPos == 0) { // initially move faster
      keyMoveYPos -= keyMoveInitial;
    } else {
      keyMoveYPos -= keyMoveRate;
    }
  }
  
  if (keyPresses.indexOf('RARRW') != -1 || keyPresses.indexOf('l') != -1) {
    if (keyMoveXPos == 0) { // initially move faster
      keyMoveXPos += keyMoveInitial;
    } else {
      keyMoveXPos += keyMoveRate;
    }
  }
  
  if (keyPresses.indexOf('DARRW') != -1 || keyPresses.indexOf('k') != -1) {
    if (keyMoveYNeg == 0) { // initially move faster
      keyMoveYNeg += keyMoveInitial;
    } else {
      keyMoveYNeg += keyMoveRate;
    }
  }

  // if opposing keys pressed, no camera movement
  if ((keyPresses.indexOf('LARRW') != -1 || keyPresses.indexOf('j') != -1) &&
      (keyPresses.indexOf('RARRW') != -1 || keyPresses.indexOf('l') != -1)) {
    keyMoveXNeg = 0;
    keyMoveXPos = 0;
  }

  if ((keyPresses.indexOf('UARRW') != -1 || keyPresses.indexOf('i') != -1) &&
      (keyPresses.indexOf('DARRW') != -1 || keyPresses.indexOf('k') != -1)) {
    keyMoveYNeg = 0;
    keyMoveYPos = 0;
  }

  mouseMovement[0] += keyMoveXNeg + keyMoveXPos;
  mouseMovement[1] += keyMoveYNeg + keyMoveYPos;
}

/**
 * Handles mouse camera movement on key up.
 */
function keyMoveReset() {
  if (keyPresses.indexOf('LARRW') == -1 && keyPresses.indexOf('j') == -1) {
    keyMoveXNeg = 0;
  }
  
  if (keyPresses.indexOf('UARRW') == -1 && keyPresses.indexOf('i') == -1) {
    keyMoveYPos = 0;
  }
  
  if (keyPresses.indexOf('RARRW') == -1 && keyPresses.indexOf('l') == -1) {
    keyMoveXPos = 0;
  } 
  
  if (keyPresses.indexOf('DARRW') == -1 && keyPresses.indexOf('k') == -1) {
    keyMoveYNeg = 0;
  }
}

/*
 * check for key pressed from the player
 */
function keyDown(e) {
	// TODO is this a bad idea?
	if (options_disableKeyPresses && e.keyCode != keymap['ESC']) {
        return;
    } else if (chatbox_disableKeyPresses) {
        return;
    }
    switch (e.keyCode) {
		case 9:
		case keymap['ENTER']:
            if (!optionMenu.hidden) {
                optionMenu.hidden = true;
            } else if (!chatBox.hidden) { 
                chatBox.hidden = true;
            } else {
			    chatBox.toggle();
            }
			break;
		/*case 16: 
		case 17: 
		case 18: */
		case 27: 
		case 32:
    case 37:
		case 38:
		case 39:
		case 40:
		case 48:
		case 49:
		case 50:
		case 51:
		case 52:
		case 53:
		case 54:
		case 55:
		case 56:
		case 57:
		case 65:
		case 66:
		case 67: // c should only be sent on keyUp
		case 68:
		case 69:
		case 70:
		case 71:
		case 72:
    case 73:
		case 74:
		case 75:
		case 76:
		case 77:
		case 78:
		case 79:
		case 80:
		case 81:
		case 82:
		case 83:
		case 84:
		case 85:
		case 86:
		case 87:
		case 88:
		case 89:
		case 90:
		case 187:
        case 189:
		case 219:
		case 221:
			// if the key is not already pressed
			if (keyPresses.indexOf(codemap[e.keyCode]) == -1) {
			keyPresses.push(codemap[e.keyCode]);
			}

			// stops TAB from being handled in the default fashion
			e.preventDefault();
			break;
		default:
			console.log("Key code '%d' not recognized", e.keyCode);
			break;
	}
}

function keyUp(e) {
	// TODO is this right? no this was not faurking right before
	while(keyPresses.indexOf(codemap[e.keyCode]) != -1) {
        keyPresses.splice(keyPresses.indexOf(codemap[e.keyCode]), 1);
	}

	switch(e.keyCode) {
		// client loop back functionality
		case keymap['m']:
			 audio.pause();
			 break;
		case keymap['ESC']:
			optionMenu.toggle();
			break;
		case keymap['TAB']:
			scoreBoard.toggle();
			break;
		case keymap['f']:
			toggleFullScreen();
			break;
        case 37:
        case 38:
        case 39:
        case 40:
        case 73:
        case 74:
        case 75:
        case 76:
              keyMoveReset();
              break;
        }
}
