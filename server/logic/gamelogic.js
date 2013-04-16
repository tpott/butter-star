/* A file to contain all of dat dere nasty game logic. */

module.exports = {
    processEvents: function(eventBuffer, worldstate) {
        /* process all of the player events from the buffer, and then
        update the players array based on which event etc */
        var playerEvents = eventBuffer.getEventsAsArray();    
    
        for (var i = 0; i < playerEvents.length; i++) {
            var playerEvent = playerEvents[i];                
            //console.log(worldstate.getPlayerObject(playerEvent.playerID));
            //console.log(worldstate.players);
            //console.log(playerEvent);
        
            // TODO add future actions that will happen on events here
            doMove(playerEvent, worldstate);
        }
    } 
};

function doMove(playerEvent, worldstate) {
    //console.log(playerEvent.moving);
    if (playerEvent.moving == true) {
        move(
            playerEvent, 
            worldstate.getPlayerObject(playerEvent.playerID)
        );
    }
}

function move(playerEvent, myPlayer){
		
    var speed = playerEvent.speed;
	//if(myPlayer.model.state === 'crstand'){speed *= .5;}
	//if(myPlayer.model.state === 'freeze') {speed *= 0;}
	if(playerEvent.sprinting == true) {
		playerEvent.speed = 0.75;
	}
	else {
		playerEvent.speed = 0.25;
	}
		
	var direction = playerEvent.angle;
	if( playerEvent.front && !playerEvent.left && !playerEvent.Backwards && !playerEvent.right){direction +=   0}
	else if( playerEvent.front &&  playerEvent.left && !playerEvent.Backwards && !playerEvent.right){direction +=  45}
	else if(!playerEvent.front &&  playerEvent.left && !playerEvent.Backwards && !playerEvent.right){direction +=  90}
	else if(!playerEvent.front &&  playerEvent.left &&  playerEvent.Backwards && !playerEvent.right){direction += 135}
	else if(!playerEvent.front && !playerEvent.left &&  playerEvent.Backwards && !playerEvent.right){direction += 180}
	else if(!playerEvent.front && !playerEvent.left &&  playerEvent.Backwards &&  playerEvent.right){direction += 225}
	else if(!playerEvent.front && !playerEvent.left && !playerEvent.Backwards &&  playerEvent.right){direction += 270}
	else if( playerEvent.front && !playerEvent.left && !playerEvent.Backwards &&  playerEvent.right){direction += 315}
		
	//myPlayer.model.objects.rotation.y = direction * Math.PI / 180;
	myPlayer.position.x -= Math.sin(direction * Math.PI / 180) * speed;
	myPlayer.position.z -= Math.cos(direction * Math.PI / 180) * speed;

    //console.log("AFTER MOVE: " + myPlayer);
}

