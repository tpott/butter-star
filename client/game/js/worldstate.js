var WorldState = function(players) {
    this.players = players;
}

WorldState.prototype.getPlayerObject = function(id) {
    for (var i = 0; i < this.players.length; ++i) {
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
