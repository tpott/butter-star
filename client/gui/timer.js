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
	this.timer.css('font-family', '\"Gtown\"');
	this.timer.css('text-align', 'center');
	this.timer.css('color', '#fff');
	this.timer.css('font-size', '60px');
	this.timer.css('width', '150px');
	this.timer.css('height', '50px');
	this.timer.css('left', '50%');
	this.timer.css('margin-left', '-100px');
 	this.timer.css('padding', '10px');
 	this.timer.css('top', '5px');
 	this.timer.css('background', 'rgba(219, 245, 255, 0.4)');
 	this.timer.css('-moz-border-radius', '10px');
 	this.timer.css('-webkit-border-radius', '10px');
}

Timer.prototype.update = function(value) {
    $('#gameTimer').html(value);
}
