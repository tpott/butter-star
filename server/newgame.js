/**
 * server/newgame.js
 *
 * A separate game process
 *
 * @author Trevor
 */

// TODO is this ok?
var gameid = process.argv[2];
var gameport = process.argv[3];

var Game = require('./objects/game.js');
var Server = require('./net/pergameWS.js');

var theGame = new Game();

// TODO bad? wasting an ID
theGame.id = gameid;

console.log("newgame!");
console.log(process.argv);

var webSocketServer = new Server(theGame, gameport);

// TODO also send the port?
process.send(theGame.id);

process.on('message', function(m) {
	if (m == 'end_game_process') {
	}
	console.log("Game received \"%s\" from parent process.", m);
});
