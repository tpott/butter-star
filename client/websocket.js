var connection = new WebSocket('ws://128.54.45.206:8080');
var testObj = {data1 : 'moo', data2: 10};

connection.onopen = function () {
  connection.send(JSON.stringify(testObj)); // Test msg sent to server
};

connection.onmessage = function(msg) {
  var received = JSON.parse(msg.data);
  console.log('Yo server said: ' + received);
};

// Log errors
connection.onerror = function(error) {
  console.log('WebSocket Error: ' + error);
};


