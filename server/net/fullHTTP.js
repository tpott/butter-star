/**
 * @fileoverview Serves up a simple, hardcoded index page over http,
 * @author Trevor Pottinger
 */

// Get external functions.
var config = require('./../../config.js');
var Game = require('./../objects/game.js');
var http = require('http'),
	 fs = require('fs'),
	 util = require('util'),
	 events = require('events');

var thinhGame = "../client/game/";

// [ Request path, file contents, repository path, content type ]
var files = [
	// library files, we were not authors
	['stats.min.js', "", thinhGame + 'js/libs/stats.min.js', 'text/javascript'],
	['three.min.js', "", thinhGame + 'js/libs/three.min.js', 'text/javascript'],
	['MTLLoader.js', "", thinhGame + 'js/loaders/MTLLoader.js', 'text/javascript'],
	['OBJMTLLoader.js', "", thinhGame + 'js/loaders/OBJMTLLoader.js', 'text/javascript'],
	// our client files
	['', "", thinhGame + 'index.html', 'text/html'],
	['PlayerEvent.js', "", thinhGame + 'js/PlayerEvent.js', 'text/javascript'],
	['PointerLockControls.js', "", thinhGame + 'js/PointerLockControls.js', 'text/javascript'],
	['THREEx.FullScreen.js', "", thinhGame + 'js/THREEx.FullScreen.js', 'text/javascript'],
	['player.js', "", thinhGame + 'js/player.js', 'text/javascript'],
	['worldstate.js', "", thinhGame + 'js/worldstate.js', 'text/javascript'],
	['connection.js', "", '../client/net/connection.js', 'text/javascript'],
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

// [ Request path, file contents, repository path, content type ]
for (var i = 0; i < files.length; i++) {
	var setFile = function(file) {
		return function(err, data) {
			if (err) throw err;
			file[1] = data;
		};
	};
	fs.readFile(files[i][2], 'utf8', setFile(files[i]));
}


/**
 * Creates an instance of a Server. Does not start up a server, only
 * initializes default member values.
 * @constructor
 */
var Server = function() {
	http.createServer(function (request, response) {
		var found = false;
		for (var i = 0; i < files.length; i++) {
			if (request.url == '/' + files[i][0]) {
				response.writeHead(200, {'Content-Type': files[i][3]});
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

	this.games = {};
}

Server.prototype.newGame = function() {
	var g = new Game();
	this.games[g.id] = g;
	return g.id;
}

Server.prototype.removeGame = function(id) {
	return delete this.games[id];
}

module.exports.files = files;
module.exports = Server;
