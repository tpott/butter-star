var WorldState = function() {
    this.players = [];
/**
 * worldstate.js
 *
 * Client side stuff.
 *
 * @author Rohan
 * @author Thinh
 * @author Trevor
 */
}

var WorldState = function() {
    this.players = {};
}

WorldState.prototype.getPlayerObject = function(id) {
    return this.players[id];
}

WorldState.prototype.addPlayer = function(p) {
	var player = new Player();
	player.id = p.id;
	player.position = p.position;
	scene.add(player.cube);
	this.players[player.id] = player;
}

WorldState.prototype.removePlayer = function(id) {
	scene.remove(this.players[id].cube);
	delete this.players[id];
}

/**
 * players is an array of player objects
 */
WorldState.prototype.updateWorldState = function(players){
	//console.log('updating world state');
	for (var i = 0; i < players.length; i++) {
		if (!(players[i].id in this.players)) {
			this.addPlayer(players[i]);
		}
		this.players[players[i].id].cube.position = players[i].position;
		//this.players[players[i].id].cube.direction = players[i].position;
	}
}
