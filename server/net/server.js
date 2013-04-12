/**
 * @fileoverview Serves up a simple, hardcoded index page over http,
 * then creates a websocket.
 * @author Jennifer Fang
 * @author Rohan Halliyal
 * @author Trevor Pottinger
 */

// Get external functions.
var config = require('./../../config.js');
var WebSocketServer = require('ws').Server;
var http = require('http');

// TODO: get path from config file
var EventBuffer =
    require('./eventBuffer.js').EventBuffer;
var Socket = require('./socket.js').Socket;

/**
 * Creates an instance of a Server. Does not start up a server, only
 * initializes default member values.
 * @constructor
 */
var Server = function() {
  /**
   * List of the open connections.
   * @type {Array.<wsWebSocket>}
   */
  this.sockets = [];

  /**
   * This is the current game state.
   * @type {Array}
   * TODO: not yet used. also want to change to be an obj
   */
  // this.games = [];

  /**
   * Instance of the WebSocketServer.
   * @type {WebSocketServer}
   */
  this.wsServer = null;

  /**
   * Buffer to hold all incoming client events.
   * @type {EventBuffer}
   */
  this.eventBuffer = null; 
}

/**
 * Start the server and set up event handlers.
 */
Server.prototype.start = function() {
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
  
  this.wsServer = new WebSocketServer({port:config.wsPort});
  this.eventBuffer = new EventBuffer();

  var socketList = this.sockets; // to use inside handler

  /**
   * Handles the server opening a connection.
   * @param {wsWebSocket} wsSocket WebSocket opening a connection with.
   */
  this.wsServer.on('connection', function(wsSocket) {
      console.log('New connection created! %d', socketList.length);
      var socket = new Socket(wsSocket);
      socketList.push(socket);

      socket.onmessage(this.eventBuffer);
      socket.onclose(socketList);
  });
}

/**
 * Return the list of sockets connected to the Server.
 * @return {Array.<wsWebSocket>} The list of sockets.
 */
Server.prototype.getSockets = function() {
    return this.sockets;
}

/**
 * Sends updated game state to all clients.
 *
 * Note(jyfang): Must send Float32Array, NOT the underlying ArrayBuffer
 * because of how ws's send works.
 */
Server.prototype.updateAllClients = function() {
	// connection.socket.send(connection.getStateTypedArray(), {binary: true});
  // TODO send typed arrays
  var s = this.eventBuffer.flushAsString();
  for (var i = 0; i < this.sockets.length; i++) {
      if (s != "") {
          if (this.sockets[i] != null) {
              this.sockets[i].send(s);
          }
      }
  }
}

exports.Server = Server;
