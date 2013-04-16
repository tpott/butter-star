/**
 * @fileoverview Sets the socket callback functions.
 * @author Jennifer Fang
 */

/**
 * Save the socket to set handlers for.
 * @param {wsWebSocket} wsSocket The socket to set handlers for.
 * @constructor
 */
var Socket = function(wsSocket) {
  if (wsSocket !== undefined) {
    this.socket = wsSocket;

    // Sending strings is fine, but otherwise send as arraybuffer
    this.socket.binaryType = 'arraybuffer';
  } else {
    // TODO: throw error instead? can't init stuff on null socket
    this.socket = null;
  }
};

/**
 * Getter for the socket.
 * @return {wsWebSocket} The underlying wsWebSocket for our Socket.
 */
Socket.prototype.getSocket = function() {
  return this.socket;
};

/**
 * Add the input received from the client to the given eventBuffer.
 * Data from client can be either string or ArrayBuffer.
 * @param {InputBuffer} eventBuffer The event buffer.
 */
Socket.prototype.onmessage = function(eventBuffer) {
  this.socket.on('message', function(data) {
      console.log("received: " + data);
    eventBuffer.addEvent(data);
  });
};

/**
 * Close the connection and remove socket from given socket list.
 * @param {Array.<wsWebSocket>} socketList The list of sockets.
 */
Socket.prototype.onclose = function(socketList, worldState, socketID) {
  var removalSocket = this;
  this.socket.on('close', function() {
    console.log("Connection to client closed.");


    console.log("removed a player: " + socketID + " on the server");
        worldState.removePlayer(socketID);
    //TODO do this in a way that doesn't leave holes in list
    for (var i = 0; i < socketList.length; i++) {
      if (removalSocket === socketList[i]) {
        
        socketList[i] = null;
      }
    }


  });
};

/**
 * Send the client a message.
 * @param {string | ArrayBuffer} msg The message to send to the client.
 */
Socket.prototype.send = function(msg) {
  this.socket.send(msg);
};

exports.Socket = Socket;
