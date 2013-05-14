/**
 * @fileoverview Configuration file for our client and server-side shared
 * members.
 * @author Jennifer Fang
 */

// TODO: Get programmer's directory for relative pathname.
var dir = '../..'; // 'jfang'; tpott
var fs = require('fs');

var configFile = 'personalConfig.json';
try {
	var pConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
}
catch (e) {
	var pConfig = {};
}

exports.wsPort = pConfig.wsPort || 8081;
exports.httpPort = pConfig.httpPort || 8078;
exports.debugPort = pConfig.debugPort || 8090;
exports.server = pConfig.server || process.argv[2] || 'localhost';

exports.spawnShell = pConfig.spawnShell || false;

// Base path for all files
var basePath = "./"; 
var progPath = basePath + dir + '/butter-star';

exports.paths = {
  clientWS: progPath + '/client/net/websocket.js',
  clientJS: progPath + '/client/net/websocket.js',
  html: progPath + '/client/index.html',
  server: progPath + '/server/net/server.js',
  vector4: progPath + '/server/net/vector4.js',
  wssConnection: progPath + '/server/net/connection.js'
};
