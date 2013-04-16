/**
 * main.js
 * @fileoverview Check that the client HTML and JS files are error-free
 * before creating a server.
 * @author Trevor Pottinger
 */

var config = require('./../config.js');
var http = require('./net/simpleHTTP.js'), 
	 ws = require('./net/simpleWS.js'), 
	 Game = require('./objects/game.js');
var fs = require('fs'),
	 crypto = require('crypto');

var games = [];

var httpServer = new http();
var wsServer = new ws();

httpServer.on('newgame', function(gameid) {
	console.log('New game: %s', gameid);
});
//wsServer.on('connection', wsServer._newSocket);

// TODO where to put this?
games.push(new Game(httpServer));

module.exports.games = games;
module.exports.httpServer = httpServer;
module.exports.wsServer = wsServer;
