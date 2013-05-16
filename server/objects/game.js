/**
 * game.js
 *
 * @fileoverview A server-side game instance. Handles the administrative
 * side of the game (i.e. updating the clients) and contains and instance
 * of the game play World.
 * @author Trevor Pottinger
 * @author Rohan Halliyal
 * @author Jennifer Fang
 */

// Get external functions
var THREE = require('three');

var randomID = require('./random.js');
var THREE = require('three');
var World = require('./world.js');

/**
 * Construct a game instance.
 * @constructor
 */
function Game() {
	// generate a random url
	this.id = randomID(4);
	this.ticks = 60; // 60 "ticks" per second!

	this.sockets = {};
	this.world = new World();
	
	//setTimeout(gameTick(this), 1000 / this.ticks);
	this.world.addCritter(100);

	setInterval(gameTick(this), 1000 / this.ticks);
}

/**
 * Send an update of all object locations to all the clients
 */
// TODO link with game logic
Game.prototype.sendUpdate = function() {
	// create info about every players location and orientation
	var allPlayers = [];
	for (var id in this.players) {
		var player = {};
		player.id = id;
		player.type = 'player';
		player.position = this.players[id].position;
		/*player.direction = this.players[id].direction;*/
		player.vacTrans = this.players[id].vacTrans;
		player.orientation = this.players[id].orientation;
		allPlayers.push(player);
	}
	
	// TODO spectators
	// send the data to each of the players + spectators
	for (var id in this.players) {
		// TODO HIGH HIGHER
		// TODO if socket is already closed and not removed yet
		this.players[id].socket.send(JSON.stringify(allPlayers));
	}
}

/**
 * Add a socket to this game.
 * @param {Socket} socket The new socket connecting to this game.
 * @return {string} The player ID.
 */
Game.prototype.addSocket = function(socket) {
  this.sockets[socket.id] = socket;
  this.world.addPlayer(socket.player);

	return socket.id;
}

/**
 * Remove a socket from the game.
 * @param {Socket} socket The socket to remove from the game.
 * @return {boolean} True if successfully removes, false otherwise.
 */
Game.prototype.removeSocket = function(socket) {
  this.world.removePlayer(socket.player);

	if (delete this.sockets[socket.id]) {
		return true;
	} else {
		return false;
	}
}

// TODO
function isEvent(anything) {
  return true;
}; 

/**
 * Handles updating a given player for a given event.
 * @param {Socket} socket The socket we are receiving the event from.
 * @param {Event} anything The event we are using to update the player.
 */
Game.prototype.eventBasedUpdate = function(socket, anything) {
    var player = socket.player;

    var obj = JSON.parse(anything);
    if (isEvent(obj)) {
        player.direction = obj.angle;
		player.isVacuum = obj.isVacuum;
        player.vacAngleY = obj.vacAngleY;
        if(obj.moving) {
            player.move(obj, this.world.collidables);
        }
        player.updateVacuum(obj);
    }
    else {
        console.log('Received unknown input: %s', anything);
    }
}

/**
 * World changes that should happen every tick regardless of
 * client events (player inputs).
 */
Game.prototype.gameTickBasedUpdate = function() {
	this.world.applyForces(); 
}

/**
 * Send an update of the world state to all clients.
 */
Game.prototype.sendUpdatesToAllClients = function() {
  var allPlayers = [];
  var allCritters = [];
	// TODO clean this up... we already have a toObj() method with
	// some info. We could override it in the Player class.
	//console.log(this.sockets);
	for (var id in this.sockets) {
   // console.log(id);
		var player = {};
		player.id = id;
		player.type = 'player';
		player.position = this.sockets[id].player.position;
		player.direction = this.sockets[id].player.direction;
		player.vacTrans = this.sockets[id].player.vacTrans;
		player.isVacuum = this.sockets[id].player.isVacuum;
        player.vacAngleY = this.sockets[id].player.vacAngleY;
		allPlayers.push(player);
	}

 var tempWorld = { players : [], critters : {} };
 //console.log(this.world.players);
 tempWorld.players = allPlayers;
 tempWorld.critters = this.world.critters;
 
	for (var id in this.sockets) {
		// TODO HIGH
		// TODO if socket is already closed and not removed yet
		this.sockets[id].send(JSON.stringify(tempWorld));
	}
  
}

// TODO comment and clean this shit
gameTick = function(game) {
	return function() {
    game.gameTickBasedUpdate();
		game.sendUpdatesToAllClients();
	}
}



module.exports = Game;
