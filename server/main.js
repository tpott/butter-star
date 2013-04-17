/**
 * main.js
 * @fileoverview Check that the client HTML and JS files are error-free
 * before creating a server.
 * @author Trevor Pottinger
 */

var config = require('./../config.js');
var http = require('./net/fullHTTP.js'), 
	 ws = require('./net/simpleWS.js'), 
	 Game = require('./objects/game.js');
var fs = require('fs'),
	 crypto = require('crypto');

var httpServer = new http();
var wsServer = new ws(httpServer);

//wsServer.on('connection', wsServer._newSocket);

// TODO when user selects 'New Game' 
console.log('New game: %s', httpServer.newGame());

module.exports.httpServer = httpServer;
module.exports.wsServer = wsServer;
