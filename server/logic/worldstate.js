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

exports.WorldState = WorldState;
