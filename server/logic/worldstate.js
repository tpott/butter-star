var Player = require('./player.js').Player;

var WorldState = function() {
    this.players = [];
    this.movingBool = false;
}

WorldState.prototype.addNewPlayer = function(id) {
    var newPlayer = new Player();
    newPlayer.id = id;
    //TODO: add spawn point and other initial shit
    this.players.push(newPlayer);

    //console.log("New player with ID " + newPlayer.id + " created!");
}

WorldState.prototype.getPlayerObject = function(id) {
    for (var i = 0; i < this.players.length; ++i) {
        if (this.players[i] != null && this.players[i].id == id) {
            return this.players[i];
        }
    }

}
WorldState.prototype.removePlayer = function(id) {
    for (var i = 0; i < this.players.length; ++i) {
        if (this.players[i] != null && this.players[i].id == id) {
            this.players[i] = null;
        }
    }
}

WorldState.prototype.processEvents = function(eventBuffer) {
    ////console.log("world state recieved event and parsed: ");

    /* process all of the player events from the buffer, and then
      update the players array based on which event etc */
    var playerEventString = "temp";
    while (playerEventString != "") {
        playerEventString = eventBuffer.getNextEvent();
        if (playerEventString == "") {
            return;
        }
        //console.log("JSON TRYING TO PARSE: " + playerEventString);
        var playerEvent = JSON.parse(playerEventString);

        if (playerEvent.playerID == -1) {
            //console.log("Someone fucked shit up");
        } else {
            //console.log(this.getPlayerObject(playerEvent.playerID));
            console.log(this.players);
            //console.log(playerEvent.playerID);

            if (playerEvent.moving == true) {
                move(playerEvent, this.getPlayerObject(playerEvent.playerID));
                var worldstate = this;
                if (worldstate.movingBool == false) {
                    var timer = setInterval( function(){
                        move(playerEvent, worldstate.getPlayerObject(playerEvent.playerID));
                    }, 1000 / 60);
                    worldstate.movingBool = true;
                }

            }
            if(playerEvent.moving == false){
                this.movingBool=false;
			    clearInterval(timer);
			}
        }
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
	if( playerEvent.front &&  playerEvent.left && !playerEvent.Backwards && !playerEvent.right){direction +=  45}
	if(!playerEvent.front &&  playerEvent.left && !playerEvent.Backwards && !playerEvent.right){direction +=  90}
	if(!playerEvent.front &&  playerEvent.left &&  playerEvent.Backwards && !playerEvent.right){direction += 135}
	if(!playerEvent.front && !playerEvent.left &&  playerEvent.Backwards && !playerEvent.right){direction += 180}
	if(!playerEvent.front && !playerEvent.left &&  playerEvent.Backwards &&  playerEvent.right){direction += 225}
	if(!playerEvent.front && !playerEvent.left && !playerEvent.Backwards &&  playerEvent.right){direction += 270}
	if( playerEvent.front && !playerEvent.left && !playerEvent.Backwards &&  playerEvent.right){direction += 315}
		
	//myPlayer.model.objects.rotation.y = direction * Math.PI / 180;
	myPlayer.position.x -= Math.sin(direction * Math.PI / 180) * speed;
	myPlayer.position.z -= Math.cos(direction * Math.PI / 180) * speed;
}

exports.WorldState = WorldState;
