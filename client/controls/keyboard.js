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
