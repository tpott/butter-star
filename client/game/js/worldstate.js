var WorldState = function() {
    this.players = {};

}

WorldState.prototype.getPlayerObject = function(id) {
	return this.players[id];
}

/*WorldState.prototype.getOtherPlayers = function(id) {
    var retVal = [];
    for (var i = 0; i < this.players.length; ++i) {
        if (this.players[i] != null && this.players[i].id != id) {
            retVal.push(this.players[i]);
        }
    }
    return retVal;
}*/

WorldState.prototype.addPlayer = function(p) {
	var player = new Player();
	player.id = p.id;
	player.position = p.position;
	scene.add(player.cube);
	this.players[player.id] = player;
}

/*WorldState.prototype.addOtherPlayers = function(playerList)  {
    for(var i = 0; i < playerList.length; ++i)
    {
        //create a client side player object
        
            var player = new Player();

            //set the player attributes based on the values of the current server-side player object
            if(playerList[i] != null)
            {
                console.log("ADDED PLAYER : " + playerList[i].id);
                player.id = playerList[i].id;
                player.position = playerList[i].position;
                this.players.push(player);
                scene.add(player.cube);
            }
            else
            {
                player = null;
                this.players.push(player);
            }
            

            //add the player to the scene
            
    }
}*/

/*WorldState.prototype.removeOtherPlayers = function(playerList){
    for(var i = 0; i < playerList.length; ++i)
    {        
        this.setPlayerObjectNull(playerList[i].id);
    }
}*/

/*WorldState.prototype.setPlayerObjectNull = function(id) {
    for (var i = 0; i < this.players.length; ++i) {
        //get the client-side player object by using the id
        if (this.players[i] != null && this.players[i].id == id) {

            console.log("removed a player with ID :::: " + id);

            //remove object from the scene
            scene.remove(this.players[i].cube);

            //set the player object at this index to be null
            this.players[i] = null;

            return;
        }
    }
}*/

WorldState.prototype.updateWorldState = function(p){
	if (!(playerEvent.id in this.players)) {
		this.addPlayer(p);
	}
	this.players[playerEvent.playerID].cube.position = p.position;
}
