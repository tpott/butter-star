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
	switch(e.keyCode) {
		case 77:        //M
             audio.pause();
			 break;
		case 67:        //C 
			if(myPlayer.vacuum == null)
			{
				myPlayer.vacuum = 
                    new Vacuum(new THREE.Vector3(
                                    myPlayer.position.x,
                                    myPlayer.position.y,
                                    myPlayer.position.z), 
                               new THREE.Vector3(0,0,-1), 
                               1000, 
                               document.getElementById('vertexShader').textContent, 
                               document.getElementById('fragmentShader').textContent);
				myPlayer.vacuum.addToScene(scene);
			}
			controlsEvent.isVacuum = true;
			break;
        case 87:		//W
			controlsEvent.front     = true;
			controlsEvent.Backwards = false;
            controlsEvent.moving = true;
			break;
		case 65:		//A
			controlsEvent.left  = true;
			controlsEvent.right = false;
            controlsEvent.moving = true;
			break;
		case 83:		//S
			controlsEvent.Backwards = true;
			controlsEvent.front     = false;
            controlsEvent.moving = true;
			break;
		case 68:		//D
			controlsEvent.right = true;
			controlsEvent.left  = false;
            controlsEvent.moving = true;
			break;
		default:
            //console.log(e.keyCode);
	}
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
		default:
			//console.log(e.keyCode);
	}

	if(!controlsEvent.front && !controlsEvent.Backwards && 
       !controlsEvent.left && !controlsEvent.right) {
		controlsEvent.moving = false;
	}
}, false);
