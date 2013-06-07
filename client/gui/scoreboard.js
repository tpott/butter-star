/**
 * client/gui/scoreboard.js
 *
 * @fileoverview Displays all player scores
 * @dependencies jQuery
 * @author Trevor
 * @author Prita Priscilla
 */

function ScoreBoard() {
	this.board = $('<div id="scoreboard" />')
		.addClass('gui')
		.attr('height', '200')
		.attr('width', '200')
		.css({ 
			'display': 'inline',
			'position': 'absolute',
			'top': '140px',
			'left': '10px',
			'border': '2px solid rgba(255, 255, 255, 0.2)',
			'background': 'rgba(100, 100, 100, 0.2)',
			'-moz-border-radius': '10px',
			'-webkit-border-radius': '10px',
			'padding': '10px'
		});

	this.title = $('<div id="scoreTitle" />')
		.append($('<h1>scoreboard</h1>'));
	this.table = $('<table />');

	this.board.append(this.title);
	this.board.append(this.table);

	$('body').append(this.board);
	this.board.show();

	this.hidden = false;
}

ScoreBoard.prototype.toggle = function() {
	if (this.hidden) {
		console.log('Showing scoreboard');

		// TODO using global in client/main.js
		if (! optionMenu.hidden) {
			optionMenu.toggle();
		}

		$('#scoreboard').show();
		this.update();

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
	$('#scoreboard table tr').remove();

	var table = $('#scoreboard table');

	// myWorldState is a global from main.js
	for (var id in myWorldState.players) {
		var row = $('<tr />');
		row.append( $('<td id="scoreText"/>').text(myWorldState.players[id].nametag.name) );
		row.append( $('<td id="scoreNumb"/>').text(myWorldState.players[id].killCount) );

		table.append(row);
	}
};

ScoreBoard.prototype.showing = function() {
	// showing when not hidden
	return ! this.hidden;
};
