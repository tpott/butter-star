/**
 * player.js
 *
 * An abstraction of a serverside player object.
 * @author Trevor Pottinger
 * @author Rohan Halliyal
 */

var randomID = require('./random.js');

function Player(socket, game) {
	this.socket = socket;
	this.game = game;
	this.id = randomID(16);
	
	// from Thinh
	this.position = {
		x : 0,
		y : -2,
		z : 0,
		direction : 0
	};
	this.camera = {
		speed : 300,
		distance : 5,
		x : 0,
		y : 0, 
		z : 0
	};

	console.log('New player: %s', this.id);
	this.socket.send('ID:' + this.id);
	console.log(JSON.stringify(this.toObj()));
}

Player.prototype.toObj = function() {
	var obj = {};
	obj.id = this.id;
	obj.position = this.position;
	obj.camera = this.camera;
	return obj;
}

Player.prototype.move = function (playerEvent) {
	var speed = playerEvent.speed;
	if(playerEvent.sprinting == true) {
		playerEvent.speed = 0.75;
	}
	else {
		playerEvent.speed = 0.25;
	}

	// TODO UGLY Thinh Rohan
	var direction = playerEvent.angle;
	if( playerEvent.front && !playerEvent.left && !playerEvent.Backwards && !playerEvent.right){direction +=   0}
	else if( playerEvent.front &&  playerEvent.left && !playerEvent.Backwards && !playerEvent.right){direction +=  45}
	else if(!playerEvent.front &&  playerEvent.left && !playerEvent.Backwards && !playerEvent.right){direction +=  90}
	else if(!playerEvent.front &&  playerEvent.left &&  playerEvent.Backwards && !playerEvent.right){direction += 135}
	else if(!playerEvent.front && !playerEvent.left &&  playerEvent.Backwards && !playerEvent.right){direction += 180}
	else if(!playerEvent.front && !playerEvent.left &&  playerEvent.Backwards &&  playerEvent.right){direction += 225}
	else if(!playerEvent.front && !playerEvent.left && !playerEvent.Backwards &&  playerEvent.right){direction += 270}
	else if( playerEvent.front && !playerEvent.left && !playerEvent.Backwards &&  playerEvent.right){direction += 315}

	this.position.x -= Math.sin(direction * Math.PI / 180) * speed;
	this.position.z -= Math.cos(direction * Math.PI / 180) * speed;

	this.socket.send(JSON.stringify(this.toObj()));
}


function PlayerEvent() {
    this.playerID  = -1;
    this.moving    = false;
    this.front     = false;
    this.Backwards = false;
    this.left      = false;
    this.right     = false;
    this.sprinting = false;
    this.speed     = .25;
    this.angle     = 0;
}

module.exports = Player;
module.exports.Event = PlayerEvent;

