
var connection = new WebSocket('ws://128.54.45.206:8080', 
	['soap', 'xmpp']);

connection.onopen = function () {
  connection.send('Sup sup sup sup'); // Send the message 'Ping' to the server
};


