/**
 * camera rotation
 */
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
// TODO delete? @Thinh overwritten later
/*document.addEventListener('mousemove', function(e){
	var mouseX = e.clientX - getElementPosition(renderer.domElement).left;
	var mouseY = e.clientY - getElementPosition(renderer.domElement).top;
	pointer.x =   (mouseX / renderer.domElement.width) * 2 - 1;
	pointer.y = - (mouseY / renderer.domElement.height) * 2 + 1;
}, false);*/

var oldPointerX = oldPointerY = oldPointer2X = oldPointer2Y = 0;
document.addEventListener('mousedown', rotateStart, false);

function rotateStart() {
	oldPointerX = pointer.x;
	oldPointerY = pointer.y;
	renderer.domElement.addEventListener('mousemove', rotate, false);
	renderer.domElement.addEventListener('mouseup', rotateStop, false);
}

function rotateStop() {
	renderer.domElement.removeEventListener('mousemove', rotate, false);
	renderer.domElement.removeEventListener('mouseup', rotateStop, false);
}

function rotate(){
	myPlayer.camera.x += (oldPointerX - pointer.x) * myPlayer.camera.speed;
	myPlayer.camera.y += (oldPointerY - pointer.y) * myPlayer.camera.speed;
	if(myPlayer.camera.y > 150){
		myPlayer.camera.y = 150;
	}
	if(myPlayer.camera.y < -150){
		myPlayer.camera.y = -150;
	}
	//console.log(myPlayer.camera.x, myPlayer.camera.y);
	controlsEvent.angle = (myPlayer.camera.x / 2) % 360;

	oldPointerX = pointer.x;
	oldPointerY = pointer.y;
}

function rotate2(){
	myPlayer.camera.x -= (pointer2.x) * myPlayer.camera.speed;
	myPlayer.camera.y += (pointer2.y) * myPlayer.camera.speed;
	//console.log(myPlayer.camera.x, myPlayer.camera.y);

	if(myPlayer.camera.y > 150){
		myPlayer.camera.y = 150;
	}
	if(myPlayer.camera.y < -150){
		myPlayer.camera.y = -150;
	}
	controlsEvent.angle = (myPlayer.camera.x / 2) % 360;
}

//document.addEventListener( 'mousemove', function(event){
function mouseMove(event) {
	//only do the on mouse move stuff if it is in fullscreen mode
	if(fullScreenMode == 1) {
		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		pointer2.y = movementY * 0.0004;
		pointer2.x = movementX * 0.0004;

		//console.log(pointer2.y, pointer2.x);


		rotate2();

		oldPointer2X = pointer.x;
		oldPointer2Y = pointer.y;
	}
}
