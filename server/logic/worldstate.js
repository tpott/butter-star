var Player = require('./player.js').Player;

var WorldState = function() {
    this.players = [];
}

WorldState.prototype.addNewPlayer = function(id) {
    var newPlayer = new Player();
    newPlayer.id = id;
    //TODO: add spawn point and other initial shit
    this.players.push(newPlayer);
}

WorldState.prototype.removePlayer = function(id) {
    for (var i = 0; i < this.players.length; ++i) {
        if (players[i] != null && players[i].id == id) {
            players[i] = null;
        }
    }
}

WorldState.prototype.processEvents = function(eventBuffer) {
    //console.log("world state recieved event and parsed: ");
}

exports.WorldState = WorldState;
