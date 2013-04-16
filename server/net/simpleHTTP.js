/**
 * @fileoverview Serves up a simple, hardcoded index page over http,
 * @author Trevor Pottinger
 */

// Get external functions.
var config = require('./../../config.js');
var http = require('http'),
	 fs = require('fs'),
	 util = require('util'),
	 events = require('events');

// simpleHTML links to the simpleJS file
var simpleHTML = "", simpleJS = "";

fs.readFile(config.paths.html, 'utf8', function(err, data) {
	if (err) throw err;
	simpleHTML = data;
});

fs.readFile(config.paths.clientJS, 'utf8', function(err, data) {
	if (err) throw err;
	simpleJS = data;
});

/**
 * Creates an instance of a Server. Does not start up a server, only
 * initializes default member values.
 * @constructor
 */
var Server = function() {
	http.createServer(function (request, response) {
		switch (request.url) {
			// TODO don't hardcode?
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
	}).listen(config.httpPort, '0.0.0.0'); // allow connections from all IPs
	console.log('HTTP server running at %d.', config.httpPort);
}

util.inherits(Server, events.EventEmitter);

module.exports = Server;
