/**
 * @fileoverview Handles login, game selection, and game loading flow, and
 * serving static files.
 * @author Trevor Pottinger
 */

// Get external functions.
var http = require('http'),
	 fs = require('fs'),
	 util = require('util'),
	 events = require('events');

var Game = require('./../objects/game.js');
var thinhGame = "../client/game/";
var client = "../client/";

// [ Request path, file contents, repository path, content type ]
var files = [
	// library files, we were not authors
	['stats.min.js', "", client + 'libs/stats.min.js', 'text/javascript'],
	['three.min.js', "", client + 'libs/three.min.js', 'text/javascript'],
	['MTLLoader.js', "", client + 'libs/MTLLoader.js', 'text/javascript'],
	['ColladaLoader.js', "", client + 'libs/ColladaLoader.js', 'text/javascript'],
	['OBJMTLLoader.js', "", client + 'libs/OBJMTLLoader.js', 'text/javascript'],
	['jquery.js', "", client + 'libs/jquery-1.9.1.js', 'text/javascript'],
	['jquery-ui.js', "", client + 'libs/jquery-ui.js', 'text/javascript'],
	['jquery-ui.css', "", client + 'libs/jquery-ui.css', 'text/css'],
	// our client files
	['', "", client + 'index.html', 'text/html'],
	['game.html', "", client + 'game.html', 'text/html'],
	//['menu.html', "", client + 'menu.html', 'text/html'],
	['font.css', "", client + 'font/font.css', 'text/css'],
	['style.css', "", client + 'css/style.css', 'text/css'],
	['game.css', "", client + 'css/game.css', 'text/css'],
	['dustismo_bold_italic.ttf', "", client + 'font/dustismo_bold_italic.ttf', 'application/octet-stream'],
	['dustismo_bold.ttf', "", client + 'font/dustismo_bold.ttf', 'application/octet-stream'],
	['dustismo_italic.ttf', "", client + 'font/dustismo_italic.ttf', 'application/octet-stream'],
	['Dustismo.ttf', "", client + 'font/Dustismo.ttf', 'application/octet-stream'],
	['loader.js', "", client + 'net/loader.js', 'text/javascript'],
	['main.js', "", client + 'main.js', 'text/javascript'],
	['ControlsEvent.js', "", client + 'controls/ControlsEvent.js', 'text/javascript'],
	['PointerLockControls.js', "", client + 'controls/PointerLockControls.js', 'text/javascript'],
	['THREEx.FullScreen.js', "", client + 'controls/THREEx.FullScreen.js', 'text/javascript'],
	['player.js', "", client + 'objects/player.js', 'text/javascript'],
	['worldstate.js', "", client + 'objects/worldstate.js', 'text/javascript'],
	['environment.js', "", client + 'objects/environment.js', 'text/javascript'],
	['critter.js', "", client + 'objects/critter.js', 'text/javascript'],
	['connection.js', "", client + 'net/connection.js', 'text/javascript'],
	['controls.js', "", client + 'controls/controls.js', 'text/javascript'],
	['keyboard.js', "", client + 'controls/keyboard.js', 'text/javascript'],
	['mouse.js', "", client + 'controls/mouse.js', 'text/javascript'],
	['screen.js', "", client + 'controls/screen.js', 'text/javascript'],
	['vacuum.js', "", client + 'shader/Vacuum.js', 'text/javascript'],
	['basic-vert.js', "", client + 'shader/basic-vert.js', 'x-shader/x-vertex'],
	['basic-frag.js', "", client + 'shader/basic-frag.js', 'x-shader/x-fragment'],
	['minimap.js', "", client + 'gui/minimap.js', 'text/javascript'],
	['options.js', "", client + 'gui/options.js', 'text/javascript'],
	['notifications.js', "", client + 'gui/notifications.js', 'text/javascript'],
	['status.js', "", client + 'gui/status.js', 'text/javascript'],
	// our data files
  ['boy.obj', "", client + 'objects/boy.obj', 'text/plain'],
  ['boy.mtl', "", client + 'objects/boy.mtl', 'text/text'],
  ['roomWithWindows.obj', "", client + 'objects/roomWithWindows.obj', 'text/plain'],
  ['roomWithWindows.mtl', "", client + 'objects/roomWithWindows.mtl', 'text/plain'],
  ['blankRoom.obj', "", client + 'objects/blankRoom.obj', 'text/plain'],
  ['blankRoom.mtl', "", client + 'objects/blankRoom.mtl', 'text/plain'],
	['yixin.png', "", client + 'objects/yixin.png', 'image/png'],
  ['yixin_cube.obj', "", client + 'objects/yixin_cube.obj', 'text/plain'],
  ['yixin_cube.mtl', "", client + 'objects/yixin_cube.mtl', 'text/plain'],
  ['boo.obj', "", client + 'objects/ghost/boo.obj', 'text/plain'],
  ['boo.mtl', "", client + 'objects/ghost/boo.mtl', 'text/plain'],
  ['boo_grp.png', "", client + 'objects/ghost/boo_grp.png', 'image/png']
	// temp data files, for Thinh's game

];

var staticGamePage = "",
	 indexPos = 0,
	 gamePos = 0;

// TODO use obj for dynamic pages

function dynamic(server, request) {
	var response = {
		head : {
			'Content-Type' : 'text/html',
		},
		found : false,
		body : '',
		end : ''
	};
	if (request.url == '/') {
		response.body = files[indexPos][1];
		response.found = true;
		return response;
	}
	else if (request.url == '/gamelist') {
		var htmlGameList = "\n";
		for (var id in server.games) {
			var game = server.games[id];
			htmlGameList += "<a href=\"" + id + "\">\n";
			htmlGameList += "\t<div class=\"activeGames\">\n";
			// game stats
			htmlGameList += "\t\t<h4>" + game.handler.status + "</h4>\n";
			htmlGameList += "\t\t<h3>" + game.world.nplayers + " players</h3>\n";
			htmlGameList += "\t\t<h5>Join game!</h5>\n";
			htmlGameList += "\t</div>\n</a>\n\n";
		}
		response.body = staticGamePage.replace(/dynamiclist/, htmlGameList);
		response.found = true;
		return response;
	}
	else if (request.url == '/newgame') {
		response.head = { 'Location' : server.newGame() };
		response.found = true;
		return response;
	}

	// return game pages
	for (var id in server.games) {
		if (request.url == '/' + id) {
			response.body = files[gamePos][1]; // file contents ;-)
			response.found = true;
			return response;
		}
	}
	
	return response;
}

/**
 * Return a response-like object that is filled with the requested
 * static file.
 */
function staticFile(server, files, request) {
	var response = {
		head : {},
		found : false,
		body : '',
		end : ''
	};
	for (var i = 0; i < files.length; i++) {
		if (request.url == '/' + files[i][0]) {
			response.head['Content-Type'] = files[i][3];
			response.head['Content-Length'] = files[i][1].length;
			response.body = files[i][1];

			if (files[i][3] == 'image/png' ||
				 files[i][3] == 'application/octet-stream') {
				response.end = 'binary';
			}

			response.found = true;
			return response; 
		}
	}
	return response;
}

/**
 * Send the response-like object if it was filled out and return true, 
 * otherwise return false and do nothing
 */
function sendResponse(responseObj, response) {
	if ('Location' in responseObj.head) {
		response.writeHead(302, responseObj.head);
		response.end();
		return;
	}
	response.writeHead(200, responseObj.head);
	try {
		response.write(responseObj.body);
	}
	catch (e) {
		console.log(e);
		//console.log(responseObj.body);
	}
	if (responseObj.end !== '') {
		response.end(responseObj.end);
	}
	else {
		response.end();
		//console.log(responseObj.body);
	}
}

/**
 * Creates an instance of a Server. Does not start up a server, only
 * initializes default member values.
 * @constructor
 */
var Server = function(config) {
	http.createServer(this.requestHandler(this))
		.listen(config.httpPort, '0.0.0.0'); // allow connections from all IPs
	console.log('HTTP server running at %d.', config.httpPort);

	this.games = [];
	this.ngames = 0; // number of games

	this.initFiles(config);
}

Server.prototype.requestHandler = function(server) {
	return function (request, response) {

		var potentialResponse = dynamic(server, request);
		if (potentialResponse.found) {
			sendResponse(potentialResponse, response);
			return;
		}

		potentialResponse = staticFile(server, files, request);
		if (potentialResponse.found) {
			sendResponse(potentialResponse, response);
			return;
		}

		// NOT FOUND
		response.writeHead(404, {});
		response.end();
	};
}


// [ Request path, file contents, repository path, content type ]
Server.prototype.initFiles = function(config) {
	for (var i = 0; i < files.length; i++) {
		var setFile = function(file) {
			return function(err, data) {
				if (err) throw err;
				if (file[3] == 'image/png') {
					file[1] = data;
				}
				else {
					file[1] = data
						.replace(/butterServerIp/g, config.server) // set in main.js
						.replace(/butterServerPort/g, config.wsPort); // ^ ditto
				}
			};
		};
		if (files[i][3] == 'image/png') {
			fs.readFile(files[i][2], setFile(files[i]));
		}
		else {
			fs.readFile(files[i][2], 'utf8', setFile(files[i]));
		}

		// needed for "dynamically" returning index
		if (files[i][0] == '') {
			indexPos = i;
		}
		else if (files[i][0] == 'game.html') {
			gamePos = i;
		}
	}

	fs.readFile(client + 'gamelist.html', 'utf8', function(err, data) {
		if (err) throw err;
		staticGamePage = data;
	});
}

Server.prototype.newGame = function() {
	var g = new Game(this);
	this.games[g.id] = g;
	this.ngames++;
	return g.id;
}

Server.prototype.removeGame = function(id) {
	if (delete this.games[id]) {
		this.ngames--;
		return true;
	}
	else {
		return false;
	}
}

module.exports.files = files;
module.exports = Server;
