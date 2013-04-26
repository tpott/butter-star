/**
 * @fileoverview Configuration file for our client and server-side shared
 * members.
 * @author Jennifer Fang
 */

// TODO: Get programmer's directory for relative pathname.
var dir = '../..'; // 'jfang'; tpott
var fs = require('fs');

function loadPersonalConfig(configFile) {
	fs.readFile(configFile, 'utf8', function(err, data) {
		var pConfig = JSON.parse(data); 

		// these are default values
		exports.wsPort = pConfig.wsPort || 8081;
		exports.httpPort = pConfig.httpPort || 8078;
		exports.debugPort = pConfig.debugPort || 8090;
		exports.server = pConfig.server || process.argv[2] || 'localhost';
	});
}
loadPersonalConfig('personalConfig.json');

// TODO: Set up everyone's own server instances and ports?
exports.wsPort = 8081;
exports.httpPort = 8078;
exports.debugPort = 8090;

// Base path for all files
// TODO this is the source of issues on changing servers
//var basePath = "/var/www/html/cse125/2013/cse125g3/";
var basePath = "./"; // FIX tpott
var progPath = basePath + dir + '/butter-star';

exports.paths = {
  clientWS: progPath + '/client/net/websocket.js',
  clientJS: progPath + '/client/net/websocket.js',
  html: progPath + '/client/index.html',
  server: progPath + '/server/net/server.js',
  vector4: progPath + '/server/net/vector4.js',
  wssConnection: progPath + '/server/net/connection.js'
};
