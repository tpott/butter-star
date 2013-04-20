/**
 * @fileoverview Check that the client HTML and JS files are error-free
 * before creating a server.
 * @author Trevor Pottinger
 */

// External classes
var config = require('./../config.js');
var fs = require('fs');
var http = require('./net/simpleHTTP.js').HTTP,
	 debug = require('./net/debugHTTP.js');

// TODO link with game logic
var games = [];

var httpServer = new http();
var wsServer = require('./net/simpleWS.js').wsServer;
var serverDebugger = new debug(httpServer, wsServer);
