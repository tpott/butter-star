/**
 * @fileoverview Check that the client HTML and JS files are error-free
 * before creating a server.
 * @author Trevor Pottinger
 */

// External classes
var config = require('./../config.js');
var fs = require('fs');
var http = require('./net/simpleHTTP.js').HTTP;

// TODO link with game logic
var games = [];
function update() {}

var ticksPerSec = 60;

function gameTick() {
	update();
}

var httpServer = new http();
var wsServer = require('./net/simpleWS.js').wsServer;
setTimeout(gameTick, 1000 / ticksPerSec);
