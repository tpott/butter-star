/**
 * client/gui/timer.js
 *
 * @fileoverview Timer gui
 * @author Rohan
 * @author Priscilla
 */

function Timer() {
	this.timer = $('<div id="gameTimer" width="100" height="100" />')
		.addClass('gui');
	$('body').append(this.timer);

	this.timer.css('display', 'inline');
	this.timer.css('position', 'absolute');
	this.timer.css('bottom', '0');
	this.timer.css('right', '0');
	this.timer.css('font-family', '\"Adventuring\"');
	this.timer.css('text-align', 'center');
	this.timer.css('color', '#fff');
	this.timer.css('font-size', '45px');
	this.timer.css('width', '150px');
	this.timer.css('height', '80px');
	this.timer.css('left', '50%');
	this.timer.css('margin-left', '-100px');
 	this.timer.css('padding', '10px');
 	this.timer.css('top', '5px');
	this.timer.css('border', '2px solid rgba(255, 255, 255, 0.2)');
 	this.timer.css('background', 'rgba(41, 191, 254, 0.5)');
 	this.timer.css('-moz-border-radius', '10px');
 	this.timer.css('-webkit-border-radius', '10px');
}

Timer.prototype.update = function(value) {
	$('#gameTimer').html('<h1>time remaining:</h1> <h2>' + value + '</h2>');
}
