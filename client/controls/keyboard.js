/*
 * check for key pressed from the player
 */
var timer;
document.addEventListener('keydown', function(e){
	if(e.shiftKey == 1) {
		controlsEvent.sprinting = true;
	}
	if(e.shiftKey == 0) {
		controlsEvent.sprinting = false;
	}

	//'m' key
	if(e.keyCode == 77) {
		audio.pause();
	}

	switch(e.keyCode) {
		case 77: audio.pause();
			 break;
		case 67: 
			if(myPlayer.vacuum == null)
			{
				myPlayer.vacuum = new Vacuum(new THREE.Vector3(myPlayer.position.x,myPlayer.position.y,myPlayer.position.z), new THREE.Vector3(0,0,-1), 1000, document.getElementById('vertexShader').textContent, document.getElementById('fragmentShader').textContent);
				myPlayer.vacuum.addToScene(scene);
			}
			controlsEvent.isVacuum = true;
			break;
		default:
	}

	if( !/65|68|83|87/.test(e.keyCode)){ 

		connection.send(controlsEvent);
		return; 
	}

	switch(e.keyCode) {
		case 87:		//W
			controlsEvent.front     = true;
			controlsEvent.Backwards = false;
			break;
		case 65:		//A
			controlsEvent.left  = true;
			controlsEvent.right = false;
			break;
		case 83:		//S
			controlsEvent.Backwards = true;
			controlsEvent.front     = false;
			break;
		case 68:		//D
			controlsEvent.right = true;
			controlsEvent.left  = false;
			break;
		default:
			//console.log(e.keyCode);
	}

	if(!controlsEvent.moving){
		controlsEvent.moving = true;
		//move();
		timer = setInterval( function(){
			//move();
			connection.send(controlsEvent);
		}, 1000 / 60);
	}
	connection.send(controlsEvent);

}, false);

document.addEventListener('keyup', function(e){
	if(e.shiftKey == 1) {
		controlsEvent.sprinting = false;
	}
	if(e.shiftKey == 0) {
		controlsEvent.sprinting = false;
	}
	switch(e.keyCode) {
		case 70: 		//F
			toggleFullScreen();
			//handleFullscreen();
			break;
		case 67: 		//C
			myPlayer.vacuum.removeFromScene(scene);
			myPlayer.vacuum = null;
			controlsEvent.isVacuum = false;
			break;
		default:
			//console.log(e.keyCode);
	}

	if( !/65|68|83|87/.test(e.keyCode)){ connection.send(controlsEvent);return; }

	switch(e.keyCode) {
		case 87:		//W
			controlsEvent.front = false;
			break;
		case 65:		//A
			controlsEvent.left = false;
			break;
		case 83:		//S
			controlsEvent.Backwards = false;
			break;
		case 68:		//D
			controlsEvent.right = false;
			break;
	}


	if(!controlsEvent.front && !controlsEvent.Backwards && !controlsEvent.left && !controlsEvent.right){
		controlsEvent.moving = false;
		clearInterval(timer);
	}
	connection.send(controlsEvent);
}, false);
