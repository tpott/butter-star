/**
 * client/gui/timer.js
 *
 * @fileoverview Timer gui
 * @author Rohan
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
    this.timer.css('font-size', '22px');
	//this.ctx.strokeStyle = '#000000';
    //this.ctx.font = "24px Arial";
}

Timer.prototype.update = function(value) {
    console.log("updating to " + value);
	// x center, y center, radius, start angle, end angle
	//this.ctx.fillText(value,0,0);
    $('#gameTimer').html(value);
}
