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
    this.critters = {};
}

WorldState.prototype.getPlayerObject = function(id) {
    return this.players[id];
}

WorldState.prototype.addPlayer = function(p) {
	var player = new Player();
	player.id = p.id;
	player.position = p.position;
    player.setMesh(scene);
	//scene.add(player.mesh);
	this.players[player.id] = player;
}

WorldState.prototype.removePlayer = function(id) {
	scene.remove(this.players[id].mesh);
	delete this.players[id];
}

/**
<<<<<<< HEAD
 * players is an array of player objects
 * world is the JSON parsed message from the server
=======
 * newStates is an array of objects, each object represents a collidable
 *   object on the server and contains: id, position, orientation, state
>>>>>>> feature/ser2CliNet
 */
WorldState.prototype.updateWorldState = function(newStates){
	for (var i = 0; i < newStates.length; i++) {
		var update = newStates[i],
			id = update.id;
		if (update.id in this.players) {
			this.players[id].position = update.position;
			this.players[id].orientation = update.orientation;
			this.players[id].state = update.state;

			// TODO ugly
			this.players[id].mesh.position = update.position;
		}
	}
  /*var players = world.players;
  var critters = world.critters;
	for (var i = 0; i < players.length; i++) {
		if (!(players[i].id in this.players)) {
			this.addPlayer(players[i]);
		}
		this.players[players[i].id].mesh.position = players[i].position;
		//this.players[players[i].id].mesh.direction = players[i].position;
		this.players[players[i].id].vacTrans = players[i].vacTrans;
        this.players[players[i].id].orientation = players[i].orientation;
        this.players[players[i].id].vacAngleY = players[i].vacAngleY;
        //console.log(this.players[players[i].id].id);
        this.players[players[i].id].isVacuum = players[i].isVacuum;
		//console.log("Player id: " + players[i].id + " direction: " + players[i].direction);
	}
  for (var i = 0; i < Object.keys(critters).length; i++)
  {
    if(!(critters[i].id in this.critters))
    {
      console.log("making a new critter id: " + critters[i].id);
      this.addCritter(critters[i]);
    }
  }*/

}

WorldState.prototype.addCritter = function(critter) {
  var crit = new Critter();
  crit.position = critter.position;
  crit.initModel(scene, 'boo', 10, crit.position);
  this.critters[critter.id] = crit;
  console.log("making a critter");
}

