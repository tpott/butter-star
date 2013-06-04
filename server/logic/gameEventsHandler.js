/**
 * server/logic/gameEventsHandler.js
 *
 * @fileoverview Handle large game events (player join, player leave, round start,
 * round end, etc..)
 * @author Trevor Pottinger
 */

var util = require('util'),
	 events = require('events');

var START_GAME_DELAY = 5 * 1000; // 5 seconds
var END_GAME_DELAY = 5 * 1000; // 5 seconds
var END_ROUND_DELAY = 5 * 1000; // 5 seconds

var CRIT_MULT = 5;

var TIMER_BONUS = 10 * 1000; // 10 seconds

function Handler(server, gameid, world) {
	// these two are needed for closing a game
	this.server = server;
	this.gameid = gameid;

	this.world = world;
    this.world.attachHandler(this);

    // time in seconds of machine when game begins
	this.start = Date.now()/1000;
    this.roundLength = 70; // length of a round as 70 seconds
    this.remainingTime = this.roundLength;
    this.timeHasChanged = true;

    // used in client gamelist
    this.status = "Not yet started";

	var self = this;


	this.on('newgame', function() {
		setTimeout(self.startRound(), START_GAME_DELAY);
	});

	this.on('newplayer', function() {
		self.message("Player joined");
	});

	this.on('delplayer', function() {
		self.message("Player left");

		if (self.world.nplayers == 0) {
			setTimeout(self.timedEndGame(), END_GAME_DELAY);
		}
	});

  this.on('delcritter', function() {
    if (self.world.ncritters == 0) {
        this.start = Date.now()/1000;
        setTimeout(self.endRound(), END_ROUND_DELAY);
    }
  });

  this.on('newround', function() {
		self.round++;

		self.message("Round " + self.round + " Starting");

		self.status = "Round " + self.round;
		self.world.spawnCritters( CRIT_MULT * self.round );
  });

  this.on('endround', function() {
	  this.timer += TIMER_BONUS;
  });

  // TODO emit gameover
  this.on('gameover', function() {
	  self.server.endGame(self.gameid);
  });
}

util.inherits(Handler, events.EventEmitter);

/**
 * Returns a function that can start the round
 * FUCK JAVASCRIPT
 */
Handler.prototype.startRound = function() {
	var self = this;
	return function() {
		self.emit('newround');
	};
}

/**
 * Send a message to all the players
 */
Handler.prototype.message = function(str) {
	var message = { 'mess' : str };
	this.world.miscellaneous.push(message);
}


/* Updates game timer
 * */
Handler.prototype.getUpdatedTime = function() {
    var temp = Date.now()/1000;
    var val = temp - this.start;
    val = Math.floor(this.roundLength - val);

    if ( val == this.remainingTime ) {
        // time has not changed, don't send an extra event
        this.timeHasChanged = false;
    } else {
        this.timeHasChanged = true;
    }

    this.remainingTime = val;
    // if time ever reaches 0, game is over.
    if (this.remainingTime == 0) {
        console.log("Time up, ending game");
        this.server.endGame(this.gameid);
    }

}

/**
 * Returns a function that will end the game
 */
Handler.prototype.timedEndGame = function() {
	var self = this;
	return function() {
		// this check if the number of players is STILL zero, so
		//   if no one has rejoined...
		if (self.world.nplayers == 0) {
			self.server.endGame(self.gameid);
		}
	};
}

Handler.prototype.hasTimeChanged = function() {
    return this.timeHasChanged;
}

Handler.prototype.getRemainingTime = function() {
    return this.remainingTime;
}
/**
 * Returns a function that will end the round
 */
Handler.prototype.endRound = function() {
	var self = this;
	return function() {
		self.emit('endround');
    self.startRound()();
	};
}


module.exports = Handler;
