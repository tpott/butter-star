
/**
 * struct for movements
 */
var playerEvent = new PlayerEvent();

/*
 * detect movements
 */
var controls,time = Date.now();

var objects = [];

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

document.addEventListener("fullscreenchange", function () {
	//console.log(document.fullscreen);
	fullScreenMode = (fullScreenMode == 1) ?  0 : 1;
	var element = document.body;
	element.requestPointerLock();
}, false);

document.addEventListener("mozfullscreenchange", function () {
	console.log(document.mozFullScreen);
	fullScreenMode = (fullScreenMode == 1) ?  0 : 1;
	var element = document.body;
	element.requestPointerLock();
}, false);

document.addEventListener("webkitfullscreenchange", function () {
	console.log(document.webkitIsFullScreen);
	console.log("yo this used webkitfullscreen");
	fullScreenMode = (fullScreenMode == 1) ?  0 : 1;
	var element = document.body;
	element.webkitRequestPointerLock();
}, false);	


/*
 * check for key pressed from the player
 */
var timer;
document.addEventListener('keydown', function(e){
	if(e.shiftKey == 1) {
		playerEvent.sprinting = true;
	}
	if(e.shiftKey == 0) {
		playerEvent.sprinting = false;
	}

	//'m' key
	if(e.keyCode == 77) {
		audio.pause();
	}

	switch(e.keyCode) {
		case 77: audio.pause();
			 break;
		default:
	}

	if( !/65|68|83|87/.test(e.keyCode)){ 

		send(playerEvent);
		return; 
	}

	switch(e.keyCode) {
		case 87:		//W
			playerEvent.front     = true;
			playerEvent.Backwards = false;
			break;
		case 65:		//A
			playerEvent.left  = true;
			playerEvent.right = false;
			break;
		case 83:		//S
			playerEvent.Backwards = true;
			playerEvent.front     = false;
			break;
		case 68:		//D
			playerEvent.right = true;
			playerEvent.left  = false;
			break;
		default:
			//console.log(e.keyCode);
	}

	if(!playerEvent.moving){
		playerEvent.moving = true;
		//move();
		timer = setInterval( function(){
			//move();
			send(playerEvent);
		}, 1000 / 60);
	}
	send(playerEvent);

}, false);

document.addEventListener('keyup', function(e){
	if(e.shiftKey == 1) {
		playerEvent.sprinting = false;
	}
	if(e.shiftKey == 0) {
		playerEvent.sprinting = false;
	}
	switch(e.keyCode) {
		case 70: 		//F
			toggleFullScreen();
			//handleFullscreen();
			break;
		default:
			//console.log(e.keyCode);
	}

	if( !/65|68|83|87/.test(e.keyCode)){ send(playerEvent);return; }

	switch(e.keyCode) {
		case 87:		//W
			playerEvent.front = false;
			break;
		case 65:		//A
			playerEvent.left = false;
			break;
		case 83:		//S
			playerEvent.Backwards = false;
			break;
		case 68:		//D
			playerEvent.right = false;
			break;
	}


	if(!playerEvent.front && !playerEvent.Backwards && !playerEvent.left && !playerEvent.right){
		playerEvent.moving = false;
		clearInterval(timer);
	}
	send(playerEvent);
}, false);


var serverWorldState;
connection.onmessage = function(buf) {
	messages[messages.length] = buf.data;
	if (buf.data.substring(0,3) == "ID:") {
		myPlayer.id = buf.data.substring(3);
		playerEvent.playerID = myPlayer.id;
		console.log("Client recieved id: " + myPlayer.id);
		return;
	}

	var state = JSON.parse(buf.data);

	if ('remove' in state) {
		// state['remove' is the id of the removed player
		myWorldState.removePlayer(state['remove']);
	}
	else {
		// state is an array of players
		myWorldState.updateWorldState(state);
	}

	var tempPlayer = myWorldState.getPlayerObject(myPlayer.id);
	myPlayer.position = tempPlayer.cube.position;
};

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
document.addEventListener('mousemove', function(e){
	var mouseX = e.clientX - getElementPosition(renderer.domElement).left;
	var mouseY = e.clientY - getElementPosition(renderer.domElement).top;
	pointer.x =   (mouseX / renderer.domElement.width) * 2 - 1;
	pointer.y = - (mouseY / renderer.domElement.height) * 2 + 1;
}, false);

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
	playerEvent.angle = (myPlayer.camera.x / 2) % 360;

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
	playerEvent.angle = (myPlayer.camera.x / 2) % 360;
}

document.addEventListener( 'mousemove', function(event){
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
}, false );

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

renderer.setSize( window.innerWidth, window.innerHeight );

}

