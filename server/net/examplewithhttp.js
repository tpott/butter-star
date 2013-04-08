/**
 * examplewithhttp.js
 *
 * Serves up a simple, hardcoded index page over http, then creates
 * a websocket
 */

var ws = require('ws').Server,
	 http = require('http'),
	 fs = require('fs');

var wsPort = 8080,
	 httpPort = 8079;

// HTTP

var htmlFile = "../../client/index.html",
	 jsFile = "../../client/net/websocket.js",
	 readCount = 0;

// to be filled when files are read
var simpleHTML = "", simpleJS = "";

function createServer() {
	http.createServer(function (request, response) {
		switch (request.url) {
			case "/websocket.js":
				response.writeHead(200, {'Content-Type': 'text/javascript'});
				response.write(simpleJS);
				break;
			default:
				response.writeHead(200, {'Content-Type': 'text/html'});
				response.write(simpleHTML);
				break;
		}
		response.end();
	}).listen(httpPort, '0.0.0.0'); // allow connections from all IP addresses
	console.log('Server listening at port=' + httpPort);
}

fs.readFile(htmlFile, 'utf8', function(err, data) {
	if (err) throw err;
	readCount++;
	simpleHTML = data;
	if (readCount == 2) createServer();
});

fs.readFile(jsFile, 'utf8', function(err, data) {
	if (err) throw err;
	readCount++;
	simpleJS = data;
	if (readCount == 2) createServer();
});

// WEB-SOCKETS

var wsServer = new ws({ port:wsPort});

// Create the server, once connection is established then execute the function
wsServer.on('connection', function(socket) {
	console.log('Connection created!');
	
	// Once a message is received by the server, execute the function
	// Assumes that all transmitted data is JSON encoded
	socket.on('message', function(msg) {
		console.log('received: %s', msg);
		GLOBAL.obj = JSON.parse(msg);
		obj['data2'] = obj['data2'] + '1337';
		socket.send(JSON.stringify(obj));
	});
	
	socket.send(JSON.stringify('rohans mind is blown'));
});
