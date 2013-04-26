/**
 * websocket.js
 * 
 * Sets up connection and communication to and from the server.
 * @author Jennifer Fang
 * @author Trevor Pottinger
 * @author Rohan Halliyal
 */

/**
 * IP address of the server we are connecting to.
 * @type {string}
 */
var ipAddr = "butterServerIp"; // replaced in server/net/fullHTTP.js
var port = "butterServerPort"; // replaced in server/net/fullHTTP.js

/**
 * The WebSocket connection to the server.
 * @type {WebSocket}
 */
var connection = new WebSocket('ws://' + ipAddr + ':' + port + 
		'/' + document.URL.replace(/.*\//,'')); // this should be the game id
connection.binaryType = 'arraybuffer';

/**
 * Handles opening a connection to the server.
 */
connection.onopen = function () {
	console.log("Connection is opened!");
};

var messages = [];
/**
 * Handles receiving messages from the server.
 *
 * Initially expect this message to be one fat game state update, the func
 * should prompt the client to update the view via an update() func.
 *  
 * @param {ArrayBuffer} msg The array from the server.
 */

/*
connection.onmessage = function(buf) {
  messages[messages.length] = buf.data;
  console.log("Client received: " + buf.data);
};
*/

/**
 * Handles connection errors.
 * @param {Error} error The error.
 */
connection.onerror = function(error) {
  console.log('WebSocket Error: ' + error);
};

connection.onclose = function() {
    console.log("connection closed!");
};

connection.onmessage = function(buf) {
	messages[messages.length] = buf.data;
	if (buf.data.substring(0,3) == "ID:") {
		myPlayer.id = buf.data.substring(3);
		controlsEvent.playerID = myPlayer.id;
		console.log("Client recieved id: " + myPlayer.id);
		return;
	}

	var state = JSON.parse(buf.data);

	if ('remove' in state) {
		// state['remove' is the id of the removed player
		myWorldState.removePlayer(state['remove']);
	}
	else {
		// state is an array of players
		myWorldState.updateWorldState(state);
	}

	var tempPlayer = myWorldState.getPlayerObject(myPlayer.id);
	myPlayer.position = tempPlayer.cube.position;
	myPlayer.vacTrans = tempPlayer.vacTrans;
};

/**

/* Receive is not needed since it will be call-back
 * */
function send(anything) {
	if (connection.readyState != 1) {
		console.log("Connection is not ready yet!");
	} else {
		connection.send(JSON.stringify(anything));
	}
}
