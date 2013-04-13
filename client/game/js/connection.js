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
var ipAddr;

// Prompt for server IP address if not already set
function initIPaddress() {
	if(localStorage.getItem('butterIPAddr') == null) {
	  ipAddr = prompt("IP address of server:", "localhost");
	  localStorage.setItem('butterIPAddr', ipAddr)
	} else {
	  ipAddr = localStorage['butterIPAddr'];
	}
}

/**
 * The WebSocket connection to the server.
 * @type {WebSocket}
 */
initIPaddress();
var connection = new WebSocket('ws://' + ipAddr + ':8081');
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
