var Player = require('./player.js').Player;

var WorldState = function() {
    this.players = [];
    this.deltaAdded = [];
    this.deltaRemoved = [];
}

WorldState.prototype.addNewPlayer = function(id) {
    var newPlayer = new Player();
    newPlayer.id = id;
    //TODO: add spawn point and other initial shit
    this.deltaAdded.push(newPlayer);
    this.players.push(newPlayer);
    //console.log("New player with ID " + newPlayer.id + " created!");
}

WorldState.prototype.getPlayerObject = function(id) {
    for (var i = 0; i < this.players.length; ++i) {
        if (this.players[i] != null && this.players[i].id == id) {
            //add into the added players list the added player
            
            return this.players[i];
        }
    }
}
WorldState.prototype.removePlayer = function(id) {
    for (var i = 0; i < this.players.length; ++i) {
        if (this.players[i] != null && this.players[i].id == id) {
            console.log("pushing a removed player ::: " + id);
            //add into the removed players list the removed player
            this.deltaRemoved.push(this.players[i]);
            this.players[i] = null;
        }
    }
}

WorldState.prototype.flushDeltas = function()
{
    //console.log("flushing deltas");
    this.deltaAdded = [];
    this.deltaRemoved = [];
}

exports.WorldState = WorldState;
