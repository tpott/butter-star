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

	// [0] necessary cause this.timer is a jquery obj
	//this.ctx = this.timer[0].getContext("2d");

	this.timer.css('display', 'inline');
	this.timer.css('position', 'absolute');
	this.timer.css('bottom', '0');
	this.timer.css('right', '0');
	//this.timer.hide();
	this.timer.css('font-family', '\"Dustismo Bold\"');
	this.timer.css('text-align', 'center');
	this.timer.css('color', '#fff');
	this.timer.css('font-size', '60px');
	this.timer.css('width', '175px');
	this.timer.css('height', '75px');
	this.timer.css('left', '50%');
	this.timer.css('margin-left', '-100px');
 	this.timer.css('padding', '10px');
 	this.timer.css('top', '5px');
 	this.timer.css('background', 'rgba(219, 245, 255, 0.4)');
 	this.timer.css('-moz-border-radius', '10px');
 	this.timer.css('-webkit-border-radius', '10px');

    //this.ctx.font = "24px Arial";
}

Timer.prototype.update = function(value) {
    console.log("updating to " + value);
	// x center, y center, radius, start angle, end angle
	//this.ctx.fillText(value,0,0);
    $('#gameTimer').html(value);
}
