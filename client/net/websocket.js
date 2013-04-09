/**
 * Sets up connection and communication to and from the server.
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

/**
 * Executes when a connection to the server is opened.
 */
connection.onopen = function () {
  connection.send('wassupppp'); // Test msg sent to server
};

/**
 * Handles receiving messages from the server.
 * @param {ArrayBuffer} msg the array from the server
 */
connection.onmessage = function(msg) {
  var received = JSON.parse(msg.data);
  console.log('Yo server said: ' + received);
};

// Log errors
connection.onerror = function(error) {
  console.log('WebSocket Error: ' + error);
};




