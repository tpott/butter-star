/**
 * @fileoverview Configuration file for our client and server-side shared
 * members.
 * @author Jennifer Fang
 */

// TODO: Get programmer's directory for relative pathname.
var dir = 'jfang';

// TODO: Set up everyone's own server instances and ports?
exports.wsPort = 8081;
exports.httpPort = 8078;

// Base path for all files
var basePath = "/var/www/html/cse125/2013/cse125g3/";
var progPath = basePath + dir + '/butter-star';

exports.paths = {
  clientWS: progPath + '/client/net/websocket.js',
  html: progPath + '/client/index.html',
  server: progPath + '/server/net/server.js',
  vector4: progPath + '/server/net/vector4.js',
  wssConnection: progPath + '/server/net/connection.js'
};
