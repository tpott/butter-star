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

/**
 * Constructor for the world instance.
 * @constructor
 */
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
WorldState.prototype.addObjects = function(objArr) {
	for (var i = 0; i < objArr.length; i++) {
		var obj = objArr[i];
		this.add(obj);
	}
}

/**
 * generic ADD function, determines type and then calls specific add
 */
WorldState.prototype.add = function(object) {
	switch (object.type) {
		case types.PLAYER:
			this.addPlayer(object);
			break;
		case types.CRITTER:
			this.addCritter(object);
			break;
		case types.ENVIRONMENT:
			this.addEnvironment(object);
			break;
		case types.FOOD:
			this.addFood(object);
			break;
		default:
			console.log("Client unrecognized type: %s", object);
	}
}

WorldState.prototype.addPlayer = function(p) {
	var player = new Player(p);
	this.players[player.id] = player;

	scene.add(player.mesh);
}

WorldState.prototype.addCritter = function(critter) {
  var crit = new Critter(critter);
  this.critters[crit.id] = crit;

  scene.add(crit.mesh);
  /*crit.position = critter.position;
  crit.initModel(scene, 'boo', 10, crit.position);
  this.critters[critter.id] = crit;
  console.log("making a critter");*/
}

WorldState.prototype.addEnvironment = function(env) {
}

WorldState.prototype.addFood = function(food) {
}

/**
 * generic REMOVE function, determines type and then calls specific remove
 */
WorldState.prototype.remove = function(object) {
}

WorldState.prototype.removePlayer = function(p) {
	scene.remove(this.players[id].mesh);
	delete this.players[id];
}

WorldState.prototype.removeCritter = function(critter) {
}

WorldState.prototype.removeEnvironment = function(env) {
}

WorldState.prototype.removeFood = function(food) {
}

// TODO remove this function? 
WorldState.prototype.getPlayerObject = function(id) {
    return this.players[id];
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
