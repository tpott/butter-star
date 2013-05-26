/**
 * client/gui/scoreboard.js
 *
 * @fileoverview Displays all player scores
 * @dependencies jQuery
 * @author Trevor
 */

function ScoreBoard() {
	this.board = $('<div id="scoreboard" />')
		.addClass('gui')
		.attr('height', '200')
		.attr('width', '200')
		.css({ 
			'display': 'inline',
			'position': 'absolute',
			'top': '50%',
			'left': '50%'
		});

	this.title = $('<div id="scoreTitle" />')
		.append($('<strong>Score</strong>'));
	this.list = $('<ul />')
		.css({
			'list-style-type': 'none'
		});

	this.board.append(this.title);
	this.board.append(this.list);

	$('body').append(this.board);
	this.board.hide();

	this.hidden = true;
}

ScoreBoard.prototype.toggle = function() {
	if (this.hidden) {
		console.log('Showing scoreboard');

		$('#scoreboard').show();
		this.update();

		// hide background
		//$('.game').css('opacity', '0.4');

		this.hidden = false;
	}
	else {
		console.log('Hiding scoreboard');
		$('#scoreboard').hide();
		$('.game').css('opacity', '1.0');

		this.hidden = true;
	}
};

ScoreBoard.prototype.update = function() {
};
