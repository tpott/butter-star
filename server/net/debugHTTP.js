/**
 * debugHTTP.js
 *
 * @fileoverview Display useful information about the current running games
 *  and players and sockets
 * @author Trevor Pottinger
 */

var http = require('http');
var config = require('./../../config.js');

function Debug(httpServer, wsServer) {
	http.createServer(this.serverCallback())
		.listen(config.debugPort, '0.0.0.0');
	console.log('Debug server running at %d.', config.debugPort);

	this.httpServer = httpServer;
	this.wsServer = wsServer;
}

Debug.prototype.serverCallback = function() {
	var debugServer = this;
	return function (request, response) {
		switch (request.url) {
			case '/':
				response.writeHead(200, {'Content-Type': 'text/html'});
				response.write(debugServer.report());
				break;
			default:
				response.writeHead(404, {'Content-Type': 'text/html'});
				response.write('<h3>Page not found</h3>');
				break;
		}
		response.end();
	};
}

/**
 * Returns an HTML representation of the http server, the web socket server,
 * and each of the game instances, and each of the connections.
 */
Debug.prototype.report = function() {
	var page = '<html>\n';
	page += this.head();
	page += this.body();
	page += '</html>';
	return page;
}

Debug.prototype.head = function() {
	return '<head><title>Dust Busters - Server Stats</title></head>\n';
}

Debug.prototype.body = function() {
	var body = '<body>\n';

	body += '<h3><b>' + this.wsServer.clients.length +
		'</b> Web Socket connections</h3>\n<table>\n'; 
	body += '<tr><th>Player ID</th><th>Game ID</th><th>Remote IP</th>' +
		'<th>Remote Port</th><th>Bytes Read</th><th>Bytes Written</th></tr>';
	for (var i = 0; i < this.wsServer.clients.length; i++) {
		// TODO functionality for close, pause, ping, resume, send
		// TODO user agent: main.wsServer.clients[0].upgradeReq.headers
		var socket = this.wsServer.clients[i];
		body += '<tr><td>' + socket.player.id + '</td>';
		body += '<td>' + socket.player.game.id + '</td>';
		body += '<td>' + socket._socket.remoteAddress + '</td>';
		body += '<td>' + socket._socket.remotePort + '</td>';
		body += '<td>' + socket._socket.bytesRead + '</td>';
		body += '<td>' + socket._socket.bytesWritten + '</td>';
		body += '</tr>\n';
		// > main.wsServer.clients[0]._socket.address()
		// { port: 8081,
		//   family: 2,
		//   address: '173.255.223.247' }
	}

	body += '</table>\n<h3><b>' + this.httpServer.ngames + 
		'</b> Game instances</h3>\n<table>';
	body += '<tr><th>Game ID</th><th>Number of players</th>' + 
		'<th>Number of critters</th>';
	for (var id in this.httpServer.games) {
		var game = this.httpServer.games[id];
		body += '<tr><td>' + game.id + '</td>';
		body += '<td>' + game.nplayers + '</td>';
		body += '<td>' + game.ncritters + '</td>';
		body += '</tr>\n';
	}

	body += '</table>\n</body>\n';
	return body; 
}

module.exports = Debug;
