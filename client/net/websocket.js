/**
 * @fileoverview Sets up connection and communication to and from server.
 * @author Jennifer Fang
 * @author Rohan Halliyal
 * @author Trevor Pottinger
 */

/**
 * IP address of the server we are connecting to.
 * @type {string}
 */
var ipAddr, port;

// Prompt for server IP address if not already set
// TODO: Set to pisa.ucsd.edu when no longer testing
if(localStorage.getItem('butterIPAddr') == null) {
  ipAddr = prompt("IP address of server:", "localhost");
  localStorage.setItem('butterIPAddr', ipAddr)
} else {
  ipAddr = localStorage['butterIPAddr'];
}

if(localStorage.getItem('butterPort') == null) {
  port = prompt("Port of server:", "8080");
  localStorage.setItem('butterPort', port)
} else {
  port = localStorage['butterPort'];
}
console.log('ipaddr %s', ipAddr);
console.log('port %s', port);

/**
 * The WebSocket connection to the server.
 * @type {WebSocket}
 */
var connection = new WebSocket('ws://' + ipAddr + ':' + port);
connection.binaryType = 'arraybuffer';

/**
 * Handles opening a connection to the server.
 */
connection.onopen = function () {
  console.log("Connection opened!");
};

/**
 * Handles receiving messages from the server.
 * @param {string | ArrayBuffer} msg The data from the server.
 */
connection.onmessage = function(buf) {
  console.log("Client received: " + buf.data);
};

/**
 * Handles connection errors.
 * @param {Error} error The error.
 */
connection.onerror = function(error) {
  console.log('WebSocket Error: ' + error);
};

/**
 * Handles closing the connection.
 */
connection.onclose = function() {
  console.log("Connection closed!");
};
