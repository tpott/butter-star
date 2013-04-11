/**
 * @fileoverview Serves up a simple, hardcoded index page over http,
 * then creates a websocket.
 * @author Jennifer Fang
 * @author Rohan Halliyal
 * @author Trevor Pottinger
 */

/**
 * Get external functions.
 */
var config = require('./../../config.js');
var WebSocketServer = require('ws').Server;
var http = require('http');
var fs = require('fs');

/**
 * The connection ports.
 * TODO: move to config file
 */
var wsPort = 8080;
var httpPort = 8079;

/**
 * Used to check both files are error free.
 */
var readCount = 0;

/**
 * Contents of the HTML and JS files.
 */
var simpleHTML = "", simpleJS = "";

/**
 * Creates an instance of a server.
 * @constructor
 */
exports.Server = function() {
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

  /**
   * List of the open connections.
   * @type {Array.<wsSocket>}
   */
  this.sockets = [];

  /**
   * This is the current game state.
   * @type {Array}
   * TODO: not yet used. also want to change to be an obj
   */
  this.world = [];

  /**
   * Instance of the WebSocketServer.
   * @type {WebSocketServer}
   */
  this.wsServer = new WebSocketServer({port:wsPort});

  /**
   * Set on connect handler.
   */
  this.wsServer.on('connection',
    /**
     * Handles the server opening a connection.
     * @param {wsSocket} socket WebSocket we are opening a connection with.
     */
    function(socket) {
	    console.log('New connection created! %d', sockets.length);
      socket.binaryType = 'arraybuffer';
      sockets.push(socket); //TODO temp solution
	
    /**
     * Handles the socket receiving a message from the client.
     * @param {string | ArrayBuffer} buf The data from the client.
     */
  	socket.on('message', function(buf) {
      // TODO: this is our handler... want to be able to grab own connection
      console.log("Message from client: " + buf);
    });
  });
}

/**
 * Updates the game state for all clients.
 * Note(jyfang): Must send Float32Array, NOT the underlying ArrayBuffer
 * because of how ws's send works.
 */
exports.Server.prototype.updateAllClients = function() {
	// connection.socket.send(connection.getStateTypedArray(), {binary: true});
  // TODO send typed arrays
  for (var i = 0; i < sockets.length; i++) {
    /*
    var s = sockets[i].getUpdatedGameState();
    if (s != "") {
      sockets[i].socket.send(s);
      sockets[i].clearGameState();
    }
    */
  }
}

/**
 * Read both the HTML and client JS files and make sure they are both error
 * free before creating a server.
 */
fs.readFile(config.paths.html, 'utf8', function(err, data) {
	if (err) throw err;
	readCount++;
	simpleHTML = data;
	if (readCount == 2) Server();
});

fs.readFile(config.paths.clientWS, 'utf8', function(err, data) {
	if (err) throw err;
	readCount++;
	simpleJS = data;
	if (readCount == 2) Server();
});
