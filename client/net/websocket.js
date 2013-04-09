/**
 * Sets up connection and communication to and from the server.
 * @author Jennifer Fang
 * @author Trevor Pottinger
 */

/**
 * IP address of the server we are connecting to.
 * @type {string}
 */
var ipAddr;

// Prompt for server IP address if not already set
if(localStorage.getItem('butterIPAddr') == null) {
  ipAddr = prompt("IP address of server:", "localhost");
  localStorage.setItem('butterIPAddr', ipAddr)
} else {
  ipAddr = localStorage['butterIPAddr'];
}

/**
 * The WebSocket connection to the server.
 * @type {WebSocket}
 */
var connection = new WebSocket('ws://' + ipAddr + ':8080');
connection.binaryType = 'arraybuffer';

var floatArr = new Float32Array(4);

/**
 * Handles opening a connection to the server.
 */
connection.onopen = function () {
  connection.send(floatArr.buffer); // Test msg sent to server
};

var messages = [];
/**
 * Handles receiving messages from the server.
 * @param {ArrayBuffer} msg The array from the server.
 */
connection.onmessage = function(buf) {
  console.log('Yo server said: ' + buf.data);
  messages[messages.length] = buf;
  floatArr[0]++;
  connection.send(floatArr.buffer);
};

/**
 * Handles connection errors.
 * @param {Error} error The error.
 */
connection.onerror = function(error) {
  console.log('WebSocket Error: ' + error);
};

