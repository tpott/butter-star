/*
 * check for key pressed from the player
 */
var timer;
function keyDown(e){
	if(e.shiftKey == 1) {
		controlsEvent.set("sprinting", true);
	}
	if(e.shiftKey == 0) {
		controlsEvent.set("sprinting", false);
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
				myPlayer.vacuum.update(myPlayer.vacTrans,controlsEvent.angle);
				myPlayer.vacuum.addToScene(scene);
			}
			controlsEvent.set("isVacuum", true);
			break;
        case 87:		//W
			controlsEvent.set("front", true);
			controlsEvent.set("Backwards", false);
            controlsEvent.set("moving", true);
			break;
		case 65:		//A
			controlsEvent.set("left", true);
			controlsEvent.set("right", false);
            controlsEvent.set("moving", true);
			break;
		case 83:		//S
			controlsEvent.set("Backwards", true);
			controlsEvent.set("front", false);
            controlsEvent.set("moving", true);
			break;
		case 68:		//D
			controlsEvent.set("right", true);
			controlsEvent.set("left", false);
            controlsEvent.set("moving", true);
			break;
		default:
            //console.log(e.keyCode);
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
		case 70: 		//F
			toggleFullScreen();
			//handleFullscreen();
			break;
		case 67: 		//C
			myPlayer.vacuum.removeFromScene(scene);
			myPlayer.vacuum = null;
			controlsEvent.set("isVacuum", false);
			break;
        case 87:		//W
			controlsEvent.set("front", false);
			break;
		case 65:		//A
			controlsEvent.set("left", false);
			break;
		case 83:		//S
			controlsEvent.set("Backwards", false);
			break;
		case 68:		//D
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
