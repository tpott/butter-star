/**
 * websocket.js
 * 
 * Sets up connection and communication to and from the server.
 * @author Jennifer Fang
 * @author Trevor Pottinger
 * @author Rohan Halliyal
 */

function array_equals(a, b) {
	if (a.length != b.length) {
		return false;
	}

	for (var i = 0; i < a.length; i++) {
		if (a[i] != b[i]) {
			return false;
		}
	}

	return true;
}

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
		if (socket.readyState != socket.OPEN) {
			console.log("Connection is not ready yet!");
		} 
		else if (array_equals(keyPresses, oldKeyPresses) && 
				mouseMovement[0] == 0 && mouseMovement[1] == 0) {
			//console.log("Nothing new from the client");
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

			// copy!!! cause javascript sucks
			oldKeyPresses = keyPresses.slice(0);
		}
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
		myWorldState.addObjects(message.new);
		myPlayer = myWorldState.players[message.id];

		var nplayers = message.vac.length;
		for (var i = 0; i < nplayers; i++) {
			myWorldState.players[message.vac[i].id]
				.updateVacuumCharge(message.vac[i].charge);
			myWorldState.players[message.kill[i].id]
				 .updateKillCounter(message.kill[i].count);
		}

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
    if ('timer' in world) {
        console.log("received timer");
        // THIS HAS THE UPDATED TIMER VALUE
        myWorldState.handleUpdatedTime(world.timer);
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
  if ('vac' in world) {
	 for (var i = 0; i < world.vac.length; i++) {
		 myWorldState.players[world.vac[i].id].updateVacuumCharge(world.vac[i].charge);
	 }
  }
  if ('kill' in world) {
	 for (var i = 0; i < world.kill.length; i++) {
		 myWorldState.players[world.kill[i].id]
			 .updateKillCounter(world.kill[i].count);
	 }
  }
	if ('misc' in world) {
		// TODO
		for (var i = 0; i < world.misc.length; i++) {
			if ('mess' in world.misc[i]) {
				notifyBar.addMessage(world.misc[i].mess);
				
				// TODO bad idea?
				if (world.misc[i].mess == "GAME OVER") {
					setTimeout(function() {
						// forces the browser to reload from server
						location.reload(true);
					}, 1000);
				}
			}
		}
	}

};

