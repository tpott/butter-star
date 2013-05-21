/**
 * websocket.js
 * 
 * Sets up connection and communication to and from the server.
 * @author Jennifer Fang
 * @author Trevor Pottinger
 * @author Rohan Halliyal
 */

function Connection(ip, port, gameid, player, world) {
	this.ip = ip;
	this.port = port;
	this.gameid = gameid;
	this.initialized = false;

	// TODO getting an undefined error, line 43
	this.messages = [];

	this.socket = new WebSocket('ws://' + this.ip + ':' + this.port + 
		'/' + this.gameid); 

	this.socket.binaryType = 'arraybuffer';
	this.socket.onopen = this._onopen;
	this.socket.onerror = this._onerror;
	this.socket.onclose = this._onclose;
	this.socket.onmessage = this._onmessage;

	var socket = this.socket;
	function clientTick() {
		 //if (hasBeenSent == false) {
			  if (socket.readyState != socket.OPEN) {
					console.log("Connection is not ready yet!");
			  } 
			  else if (keyPresses.length == 0 && mouseMovement[0] == 0 &&
				  mouseMovement[1] == 0) {
				  //console.log("keyPresses is empty");
			  }
			  else {
				  // client side networking happens HERE. BOOM
				  var allData = keyPresses.slice(0); // aka clone
				  if (mouseMovement[0] != 0 || mouseMovement[1] != 0) {
					  allData.push(mouseMovement);
				  }
					socket.send(JSON.stringify(allData));
					mouseMovement[0] = 0;
					mouseMovement[1] = 0;
					/*
					// dont flag event as sent if vacuum is on since client can be
					// moving without pressing any keys (acceleration)
					if (controlsEvent.isVacuum == false) {
						hasBeenSent = true; 
					}
					*/
			  }
		 //}
	}

	setInterval(clientTick, 1000/60);
}

Connection.prototype._onopen = function() {
	console.log("Connection is opened!");
};

Connection.prototype._onerror = function(err) {
  console.log('WebSocket Error: ' + err);
};

Connection.prototype._onclose = function() {
    console.log("connection closed!");
};

Connection.prototype._onmessage = function(buf) {
	// TODO undefined error here
	//this.messages.push(buf.data);

	var message = JSON.parse(buf.data);
	if (! this.initialized) {
		// this does the same thing as adding new objects
		myWorldState.addObjects(message.world);
		myPlayer = myWorldState.players[message.id];

		console.log("Client recieved id: " + message.id);

		this.initialized = true;
		return;
	}

	var world = message;
	if ('del' in world) {
		var deleteIds = world.del;
		for (var i = 0; i < deleteIds.length; i++) {
			myWorldState.remove(deleteIds[i].id);
		}
	}
	if ('new' in world) {
		// world.new should be the same as what is received in the initial
		//  message.world
		myWorldState.addObjects(world.new);
	}
	if ('set' in world) {
		// passes in an array of updated info
		myWorldState.updateWorldState(world.set);
	}
	if ('misc' in world) {
		// TODO
		for (var i = 0; i < world.misc.length; i++) {
			if ('mess' in world.misc[i]) {
				notifyBar.addMessage(world.misc[i].mess);
			}
		}
	}

};

