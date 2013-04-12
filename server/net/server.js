/**
 * @fileoverview Serves up a simple, hardcoded index page over http,
 * then creates a websocket.
 * @author Jennifer Fang
 * @author Rohan Halliyal
 * @author Trevor Pottinger
 */

// Get external functions.
var WebSocketServer = require('ws').Server;
var http = require('http');

// The connection ports. TODO: move to config file
var wsPort = 8081, httpPort = 8078;
// TODO: get path from config file
var EventBuffer =
    require('./eventBuffer.js').EventBuffer;

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
  // RENAME this.socketList
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
  
  this.wsServer = new WebSocketServer({port:wsPort});
  this.eventBuffer = new EventBuffer();
  
  /**
   * Use these local variables in socket callback functions because
   * can't use "this" to refer to Server from inside those functions.
   */
  // REMOVE THESE
  var socketList = this.sockets;
  var eventsHandler =  this.eventBuffer;

  /**
   * Handles the server opening a connection.
   * @param {wsWebSocket} wsSocket WebSocket opening a connection with.
   */
  this.wsServer.on('connection', function(socket) { // RENAME wsSocket
	    console.log('New connection created! %d', socketList.length);
      // var socket = new Socket(wsSocket);
      // var socketList.push(socket);
      socket.binaryType = 'arraybuffer';
      socketList.push(socket);

      /**
       * Handles the socket receiving a message from the client.
       * @param {string | ArrayBuffer} data The data from the client.
       */
      socket.on('message', function(data) {
          console.log("Message from client: " + data);
          eventsHandler.addEvent(data);
      });
      // socket.onmessage(this.eventBuffer);

      /**
       * Handles the socket closing or disconnecting. Removes socket
       * from socketList.
       */
      socket.on('close', function () {
          console.log("socket dc");
          // TODO: do we want to do this in a way that doesn't leave
          // holes in our list?
          for (var i = 0; i < socketList.length; i++) {
              if (socket === socketList[i]) {
                  socketList[i] = null;
              }
          }
      });
      // socket.onclose(this.socketList);
  });
}

/**
 * Return the list of sockets connected to the Server.
 */
Server.prototype.getSockets = function() {
    // RENAME this.socketList
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
  // RENAME this.socketList
  for (var i = 0; i < this.sockets.length; i++) {
      if (s != "") {
          if (this.sockets[i] != null) {
              this.sockets[i].send(s);
          }
      }
  }
}

exports.Server = Server;
