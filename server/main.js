/**
 * main.js
 * @fileoverview Check that the client HTML and JS files are error-free
 * before creating a server.
 * @author Trevor Pottinger
 */

// External classes
var config = require('./../config.js');
var http = require('./net/simpleHTTP.js');
var Game = require('./objects/game.js');
var fs = require('fs'),
	 crypto = require('crypto');

var games = [];

var httpServer = new http();
var wsServer = require('./net/simpleWS.js').wsServer;

httpServer.on('newgame', function(gameid) {
	console.log('New game: %s', gameid);
});

// TODO where to put this?
games.push(new Game(httpServer));
