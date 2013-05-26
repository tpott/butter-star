/**
 * client/gui/options.js
 *
 * @fileoverview Present an interface to change client options. This depends
 * on having jQuery
 * @author Trevor
 */

function OptionMenu() {
	this.menu = $('<div id="options" />')
		.addClass('gui')
		.attr('height', '200')
		.attr('width', '200')
		.css({ 
			'display': 'inline',
			'position': 'absolute',
			'top': '50%',
			'left': '50%'
		});

	this.title = $('<div id="optionsTitle" />')
		.append($('<strong>Menu</strong>'));
	this.list = $('<ul />')
		.css({
			'list-style-type': 'none'
		})
		.append($('<li />')
			.append('Show hints')
			.append($('<input type="checkbox" />'))
		)
		.append($('<li />')
			.append($('<button>Example</button>'))
		);

	this.menu.append(this.title);
	this.menu.append(this.list);

	$('body').append(this.menu);
	this.menu.hide();

	this.hidden = true;
}

OptionMenu.prototype.toggle = function() {
	if (this.hidden) {
		console.log('Showing options');
		$('#options').show();
		$('.game').css('opacity', '0.4');

		this.hidden = false;
	}
	else {
		console.log('Hiding options');
		$('#options').hide();
		$('.game').css('opacity', '1.0');

		this.hidden = true;
	}
}
