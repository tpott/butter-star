/**
 * client/gui/minimap.js
 *
 * @fileoverview The interface for having a minimap overlayed on the game.
 * There is a dependancy on jQuery.
 * @author Trevor
 */


function Minimap() {
	this.map = $('<canvas id="minimap" width="100" height="100" />')
		.addClass('gui');
	$('body').append(this.map);

	// [0] necessary cause this.map is a jquery obj
	this.ctx = this.map[0].getContext("2d");

	this.map.css('display', 'inline');
	this.map.css('position', 'absolute');
	this.map.css('bottom', '0');
	this.map.css('left', '0');
	this.map.css('opacity', '0'); // this hides the mini map for now hehe
	//this.map.hide();
}

Minimap.prototype.drawCircle = function() {
/*
	this.ctx.strokeStyle = '#000000';
	this.ctx.lineWidth = 5;
	this.ctx.lineCap = 'round';

	// x center, y center, radius, start angle, end angle
	this.ctx.arc(50, 50, 45, 0, 2 * Math.PI);

	this.ctx.stroke();
*/
}


