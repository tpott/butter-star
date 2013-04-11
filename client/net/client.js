/**
 * @fileoverview Interface clients may use to send and receive data
 * to and from server.
 * @author Rohan Halliyal
 */

var floatArr = new Float32Array(4);

/**
 * Receive is not needed since it will be call-back
 */
function send(data) {
  // Connection is the client's connection created in websocket.js
	if (connection.readyState != 1) {
		console.log("Connection is not ready yet!");
	} else {
		connection.send(JSON.stringify(data));
	}
}
