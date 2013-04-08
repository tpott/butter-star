// Create the connection
var connection = new WebSocket('ws://128.54.45.206:8080');
var testObj = {data1 : 'moo', data2: 10};

/* Once the connection is etablished, this method will be called. Sends our testObj
 * over the socket
*/
connection.onopen = function () {
  connection.send(JSON.stringify(testObj)); // Test msg sent to server
};

/* On receive of a message, take the msg's data and parse that (we assume 
 * messages that are transmitted will be encoded in JSON format.
 */
connection.onmessage = function(msg) {
  var received = JSON.parse(msg.data);
  console.log('Yo server said: ' + received);
};

// Log errors
connection.onerror = function(error) {
  console.log('WebSocket Error: ' + error);
};




