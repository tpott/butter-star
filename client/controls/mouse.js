/**
 * camera rotation
 * Mouse events: mousedown, mouseup, mousemove, mouseout, mouseover
 */

// TODO unused?
var getElementPosition = function(element) {
	var top = left = 0;
	do {
		top  += element.offsetTop  || 0;
		left += element.offsetLeft || 0;
		element =  element.offsetParent;
	} while (element);
	return {top: top, left: left};
}

var pointer = {x : 0, y : 0};
var pointer2 = {x : 0, y : 0};

var clickPoint = { x: 0, y: 0 };

var oldPointerX = oldPointerY = oldPointer2X = oldPointer2Y = 0;

function mouseDown(evt) {
}

function rotateStart() {
	oldPointerX = pointer.x;
	oldPointerY = pointer.y;
	renderer.domElement.addEventListener('mousemove', rotate, false);
	renderer.domElement.addEventListener('mouseup', rotateStop, false);
}

// TODO move to server
function rotateCamera() {
	myPlayer.camera.x -= (pointer2.x) * myPlayer.camera.speed;
	myPlayer.camera.y += (pointer2.y) * myPlayer.camera.speed;
	//console.log(myPlayer.camera.x, myPlayer.camera.y);

	if(myPlayer.camera.y > 178){
		myPlayer.camera.y = 178;
	}
	if(myPlayer.camera.y < -178){
		myPlayer.camera.y = -178;
	}
	controlsEvent.set("angle", (myPlayer.camera.x / 2) % 360);
    controlsEvent.set("vacAngleY", (myPlayer.camera.y / 2) % 180);
}

function mouseMove(evt) {
    if (options_disableKeyPresses || chatbox_disableKeyPresses) {
        return;
    }
	var movementX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || 0;
	var movementY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || 0;

	mouseMovement[0] += movementX;
	mouseMovement[1] += movementY;
	//console.log(mouseMovement);
	/*pointer2.y = movementY * 0.0004;
	pointer2.x = movementX * 0.0004;

	rotateCamera();

	oldPointer2X = pointer.x;
	oldPointer2Y = pointer.y;*/
}
