/**
 * main.js
 * @fileoverview Check that the client HTML and JS files are error-free
 * before creating a server.
 * @author Trevor Pottinger
 */

// External classes
var config = require('./../config.js');
var http = require('./net/simpleHTTP.js').HTTP;
var fs = require('fs'),
	 crypto = require('crypto');

var games = [];

// TODO link with game logic
function update() {}
function render() {}
function Game(httpServer) {
	// generate a random url
	var sha = crypto.createHash('sha256');
	sha.update('' + Date.now(), 'utf8');
	this['game-id'] = sha.digest('base64')
		.slice(0,10)			// make shorter
		.replace(/\+/g, "-")	// replace non-url friendly characters
		.replace(/\//g, "_")
		.replace(/=/g, ",");

	// this line is quite nifty
	httpServer.emit('newgame', this['game-id']);
}

var ticksPerSec = 60;

// TODO this should be run per game
function gameTick() {
	update();
	render(); // this gets sent to each of the clients
}

// TODO this should be run per game
setTimeout(gameTick, 1000 / ticksPerSec);

var httpServer = new http();
var wsServer = require('./net/simpleWS.js').wsServer;

httpServer.on('newgame', function(gameid) {
	console.log('New game: %s', gameid);
});

// TODO where to put this?
games.push(new Game(httpServer));
