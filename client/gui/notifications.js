/**
 * client/gui/notifications.js
 *
 * Add a notification bar towards the middle upper part of the screen.
 * This file has a dependency: jQuery.
 *
 * @author Trevor Pottinger
 */

var NOTIFY_DELAY = 9 * 1000; // 9 seconds

function Notify() {
	// TODO positioning
	this.bar = $('<div id="notify" align="center" />')
		.addClass('gui')
		.css('background-color', 'transparent')
		.css('display', 'inline')
		.css('position', 'absolute')
		.css('left', '30%');

	$('body').append(this.bar);
}

/**
 * Create a new message using the string input: str
 */
Notify.prototype.addMessage = function(str) {
	var message = $('<h3 />')
		.text(str);
//		.css('background-color', 'transparent');
	this.bar.append(message);

	setTimeout(this.popMessage(message), NOTIFY_DELAY);
	// http://api.jquery.com/slideDown/
	//message.slideDown(NOTIFY_DELAY, this.popMessage(message));
}

/**
 * Returns a function that will remove the correct jQuery object
 */
Notify.prototype.popMessage = function(jqMess) {
	return function() {
		jqMess.remove();
	};
}
