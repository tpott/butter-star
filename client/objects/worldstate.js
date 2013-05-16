/**
 * worldstate.js
 *
 * Client side stuff.
 *
 * @author Rohan
 * @author Thinh
 * @author Trevor
 */

// also set in server/objects/collidable.js
var types = {
	COLLIDABLE : 0,
	MOVABLE : 1,
	PLAYER : 2,
	CRITTER : 3,
	ENVIRONMENT : 4,
	FOOD : 5
};

var WorldState = function() {
    this.players = {};
    this.critters = {};
	 this.environments = {};
	 this.food = {};
}

/**
 * initialize this world state based off of the recevied initial server
 * data, including players, environments, critters, and food
 */
WorldState.prototype.initWorld = function(initWorldArr) {
	for (var i = 0; i < initWorldArr.length; i++) {
		var obj = initWorldArr[i];
	}
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
 * newStates is an array of objects, each object represents a collidable
 *   object on the server and contains: id, position, orientation, state
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

}

WorldState.prototype.addCritter = function(critter) {
  var crit = new Critter();
  crit.position = critter.position;
  crit.initModel(scene, 'boo', 10, crit.position);
  this.critters[critter.id] = crit;
  console.log("making a critter");
}

