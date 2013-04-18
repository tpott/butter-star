/**
 * debugHTTP.js
 *
 * @fileoverview Display useful information about the current running games
 *  and players and sockets
 * @author Trevor Pottinger
 */

var http = require('http');

function Debug(httpServer, wsServer) {
	http.createServer(function (request, response) {
		switch (request.url) {
			case '/':
				break;
			default:
				break;
		}
	}).listen(config.debugPort, '0.0.0.0');
	console.log('Debug server running at %d.', config.debugPort);
}

module.exports = Debug;
