/**
 * @fileoverview Serves up a simple, hardcoded index page over http,
 * @author Trevor Pottinger
 */

// Get external functions.
var Game = require('./../objects/game.js');
var http = require('http'),
	 fs = require('fs'),
	 util = require('util'),
	 events = require('events');

var client = "../client/",
	 thinhGame = "../client/game/";

console.log("HERE");
// [ Request path, file contents, repository path, content type ]
var files = [
	// library files, we were not authors
	['stats.min.js', "", client + 'libs/stats.min.js', 'text/javascript'],
	['three.min.js', "", client + 'libs/three.min.js', 'text/javascript'],
	['MTLLoader.js', "", client + 'libs/MTLLoader.js', 'text/javascript'],
	['OBJMTLLoader.js', "", client + 'libs/OBJMTLLoader.js', 'text/javascript'],
	// our client files
	['', "", client + 'index.html', 'text/html'],
	['ControlsEvent.js', "", client + 'controls/ControlsEvent.js', 'text/javascript'],
	['PointerLockControls.js', "", client + 'controls/PointerLockControls.js', 'text/javascript'],
	['THREEx.FullScreen.js', "", client + 'controls/THREEx.FullScreen.js', 'text/javascript'],
	['player.js', "", client + 'objects/player.js', 'text/javascript'],
	['worldstate.js', "", client + 'objects/worldstate.js', 'text/javascript'],
	['connection.js', "", client + 'net/connection.js', 'text/javascript'],
	['controls.js', "", client + 'controls/controls.js', 'text/javascript'],
	['keyboard.js', "", client + 'controls/keyboard.js', 'text/javascript'],
	['mouse.js', "", client + 'controls/mouse.js', 'text/javascript'],
	['screen.js', "", client + 'controls/screen.js', 'text/javascript'],
	// our data files
	// temp data files, for Thinh's game
	['KokiriForest.obj', "", thinhGame + 'data/forest/KokiriForest.obj', 'text/plain'],
	['KokiriForest.mtl', "", thinhGame + 'data/forest/KokiriForest.mtl', 'text/text'],
	['player.png', "", thinhGame + 'data/player.png', 'image/png'],
	['Paris2.ogg', "", thinhGame + 'data/sounds/Paris2.ogg', 'audio/ogg'],

	// Fuck you thinh
	['awninga.png', "", thinhGame + 'data/forest/awninga.png', 'image/png'],
	['awning.png', "", thinhGame + 'data/forest/awning.png', 'image/png'],
	['bark.png', "", thinhGame + 'data/forest/bark.png', 'image/png'],
	['bridgea.png', "", thinhGame + 'data/forest/bridgea.png', 'image/png'],
	['bridge.png', "", thinhGame + 'data/forest/bridge.png', 'image/png'],
	['bush.png', "", thinhGame + 'data/forest/bush.png', 'image/png'],
	['bushside.png', "", thinhGame + 'data/forest/bushside.png', 'image/png'],
	['curtaina.png', "", thinhGame + 'data/forest/curtaina.png', 'image/png'],
	['curtain.png', "", thinhGame + 'data/forest/curtain.png', 'image/png'],
	['cut.png', "", thinhGame + 'data/forest/cut.png', 'image/png'],
	['deada.png', "", thinhGame + 'data/forest/deada.png', 'image/png'],
	['dead.png', "", thinhGame + 'data/forest/dead.png', 'image/png'],
	['doodda.png', "", thinhGame + 'data/forest/doodda.png', 'image/png'],
	['doodd.png', "", thinhGame + 'data/forest/doodd.png', 'image/png'],
	['doodha.png', "", thinhGame + 'data/forest/doodha.png', 'image/png'],
	['doodh.png', "", thinhGame + 'data/forest/doodh.png', 'image/png'],
	['doodsa.png', "", thinhGame + 'data/forest/doodsa.png', 'image/png'],
	['doods.png', "", thinhGame + 'data/forest/doods.png', 'image/png'],
	['edge.png', "", thinhGame + 'data/forest/edge.png', 'image/png'],
	['enter.png', "", thinhGame + 'data/forest/enter.png', 'image/png'],
	['exit.png', "", thinhGame + 'data/forest/exit.png', 'image/png'],
	['fade.png', "", thinhGame + 'data/forest/fade.png', 'image/png'],
	['fencea.png', "", thinhGame + 'data/forest/fencea.png', 'image/png'],
	['fence.png', "", thinhGame + 'data/forest/fence.png', 'image/png'],
	['fencewa.png', "", thinhGame + 'data/forest/fencewa.png', 'image/png'],
	['fencew.png', "", thinhGame + 'data/forest/fencew.png', 'image/png'],
	['grassmix.png', "", thinhGame + 'data/forest/grassmix.png', 'image/png'],
	['grass.png', "", thinhGame + 'data/forest/grass.png', 'image/png'],
	['house.png', "", thinhGame + 'data/forest/house.png', 'image/png'],
	['laddera.png', "", thinhGame + 'data/forest/laddera.png', 'image/png'],
	['ladder.png', "", thinhGame + 'data/forest/ladder.png', 'image/png'],
	['leafa.png', "", thinhGame + 'data/forest/leafa.png', 'image/png'],
	['leaf.png', "", thinhGame + 'data/forest/leaf.png', 'image/png'],
	['ledge.png', "", thinhGame + 'data/forest/ledge.png', 'image/png'],
	['mido.png', "", thinhGame + 'data/forest/mido.png', 'image/png'],
	['patcha.png', "", thinhGame + 'data/forest/patcha.png', 'image/png'],
	['patch.png', "", thinhGame + 'data/forest/patch.png', 'image/png'],
	['pathe.png', "", thinhGame + 'data/forest/pathe.png', 'image/png'],
	['path.png', "", thinhGame + 'data/forest/path.png', 'image/png'],
	['patht.png', "", thinhGame + 'data/forest/patht.png', 'image/png'],
	['porch.png', "", thinhGame + 'data/forest/porch.png', 'image/png'],
	['raila.png', "", thinhGame + 'data/forest/raila.png', 'image/png'],
	['rail.png', "", thinhGame + 'data/forest/rail.png', 'image/png'],
	['saria.png', "", thinhGame + 'data/forest/saria.png', 'image/png'],
	['shop.png', "", thinhGame + 'data/forest/shop.png', 'image/png'],
	['shrooma.png', "", thinhGame + 'data/forest/shrooma.png', 'image/png'],
	['shroom.png', "", thinhGame + 'data/forest/shroom.png', 'image/png'],
	['step.png', "", thinhGame + 'data/forest/step.png', 'image/png'],
	['steptop.png', "", thinhGame + 'data/forest/steptop.png', 'image/png'],
	['tower.png', "", thinhGame + 'data/forest/tower.png', 'image/png'],
	['treesa.png', "", thinhGame + 'data/forest/treesa.png', 'image/png'],
	['trees.png', "", thinhGame + 'data/forest/trees.png', 'image/png'],
	['treetopa.png', "", thinhGame + 'data/forest/treetopa.png', 'image/png'],
	['treetop.png', "", thinhGame + 'data/forest/treetop.png', 'image/png'],
	['trunks.png', "", thinhGame + 'data/forest/trunks.png', 'image/png'],
	['vinea.png', "", thinhGame + 'data/forest/vinea.png', 'image/png'],
	['vineha.png', "", thinhGame + 'data/forest/vineha.png', 'image/png'],
	['vineh.png', "", thinhGame + 'data/forest/vineh.png', 'image/png'],
	['vine.png', "", thinhGame + 'data/forest/vine.png', 'image/png'],
	['vinewa.png', "", thinhGame + 'data/forest/vinewa.png', 'image/png'],
	['vinew.png', "", thinhGame + 'data/forest/vinew.png', 'image/png'],
	['wall.png', "", thinhGame + 'data/forest/wall.png', 'image/png'],
	['walls.png', "", thinhGame + 'data/forest/walls.png', 'image/png'],
	['water.png', "", thinhGame + 'data/forest/water.png', 'image/png']

];


/**
 * Creates an instance of a Server. Does not start up a server, only
 * initializes default member values.
 * @constructor
 */
var Server = function(config) {
	http.createServer(function (request, response) {
		var found = false;
		for (var i = 0; i < files.length; i++) {
			if (request.url == '/' + files[i][0]) {
				response.writeHead(200, {
					'Content-Type': files[i][3],
					'Content-Length': files[i][1].length
				});
				response.write(files[i][1]);
				found = true;

				if (files[i][3] == 'image/png') response.end('binary');
				else response.end();

				break;
			}
		}
		if (!found) {
			response.writeHead(404, {});
			response.end();
		}
	}).listen(config.httpPort, '0.0.0.0'); // allow connections from all IPs
	console.log('HTTP server running at %d.', config.httpPort);

	this.games = [];
	this.ngames = 0; // number of games

	this.initFiles(config);
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
						.replace(/butterServerIp/g, config.ip); // set in main.js
				}
			};
		};
		if (files[i][3] == 'image/png') {
			fs.readFile(files[i][2], setFile(files[i]));
		}
		else {
			fs.readFile(files[i][2], 'utf8', setFile(files[i]));
		}
	}
}

Server.prototype.newGame = function() {
	var g = new Game();
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
