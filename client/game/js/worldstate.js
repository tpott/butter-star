var WorldState = function() {
    this.players = [];

}

WorldState.prototype.getPlayerObject = function(id) {
    for (var i = 0; i < this.players.length; ++i) {
        //console.log(id + " vs " + this.players[i].id)
        if (this.players[i] != null && this.players[i].id == id) {
            return this.players[i];
        }
    }
}

WorldState.prototype.getOtherPlayers = function(id) {
    var retVal = [];
    for (var i = 0; i < this.players.length; ++i) {
        if (this.players[i] != null && this.players[i].id != id) {
            retVal.push(this.players[i]);
        }
    }
    return retVal;
}

WorldState.prototype.addOtherPlayers = function(playerList)  {
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
}

WorldState.prototype.removeOtherPlayers = function(playerList){
    for(var i = 0; i < playerList.length; ++i)
    {        
        this.setPlayerObjectNull(playerList[i].id);
    }
}

WorldState.prototype.setPlayerObjectNull = function(id) {
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
}

var cWS;

WorldState.prototype.updateWorldState = function(worldState){

    //update the worldState player numbers
    cWS = worldState;
    this.addOtherPlayers(worldState.deltaAdded);
    this.removeOtherPlayers(worldState.deltaRemoved);


    for(var i = 0; i < this.players.length; ++i)
    {
        if(this.players[i] != null)
        {

            this.players[i].cube.position = worldState.players[i].position;
        }
    }

}
