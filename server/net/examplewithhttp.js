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

// WEB-SOCKETS

var wsServer = new ws({ port:wsPort});
sockets = [];
buffers = [];

// Create the server, once connection is established then execute the function
wsServer.on('connection', function(socket) {
	console.log('New connection created! %d', sockets.length);
	sockets[sockets.length] = socket; 
	
	socket.on('message', function(buf) {
    var dv = new DataView(buf);
    /*
		var tempArray = new Float32Array(
        dv.byteLength / Float32Array.BYTES_PER_ELEMENT);
		for (var jj = 0; jj < tempArray.length; jj++) {
			tempArray[jj] = dv.getFloat32(
          jj * Float32Array.BYTES_PER_ELEMENT, true);
		}
    */
    //var tempArray = new Float32Array(buf);
		//socket.send('DAMNED ARRAY INDEX 0: ' + dv.getFloat32(0, true));
		socket.send('DAMNED ARRAY INDEX 0: ' + buf.readFloatLE(0));
		buffers[buffers.length] = buf;
	});
});

console.log('WebSockets port=' + wsPort);
