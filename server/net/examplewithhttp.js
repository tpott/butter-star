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
	console.log('HTTP Server port=' + httpPort);
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

// OBJECT ORIENTED
function Vector4() {
	this.arr = new Float32Array(4);
	this.byteLength = 16;
}

// this copies the buffer into the vector4
Vector4.prototype.set = function (buffer) {
	var intarr = new Uint8Array(this.arr.buffer);
	for (var i = 0; i < this.byteLength; i++) {
		intarr[i] = buffer[i];
	}
};

// WEB-SOCKETS

var wsServer = new ws({ port:wsPort});
sockets = [];
vectors = [];
buffers = [];

/**
 * sends a Vector4 object over specified socket
 */
vecsend = function(socket, vec) {
	// access the Vector4's array's buffer
	socket.send(vec.arr.buffer, {binary:true});
}

// Create the server, once connection is established then execute the function
wsServer.on('connection', function(socket) {
	console.log('New connection created! %d', sockets.length);
	sockets[sockets.length] = socket; 
	vectors[vectors.length] = new Vector4();
	
	socket.on('message', function(buf) {
		console.log(buf);
		buffers[buffers.length] = buf;
		vectors[vectors.length-1].set(buf);
	});
});

console.log('WebSockets port=' + wsPort);
