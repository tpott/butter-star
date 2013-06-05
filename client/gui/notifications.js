/**
 * client/gui/notifications.js
 *
 * Add a notification bar towards the middle upper part of the screen.
 * This file has a dependency: jQuery.
 *
 * @author Trevor Pottinger
 * @author Prita Priscilla Hasjim
 */

var NOTIFY_DELAY = 9 * 1000; // 9 seconds

function Notify() {
	// TODO positioning
	this.bar = $('<div id="notify" align="center" />')
		.addClass('gui');

	$('body').append(this.bar);
}

/**
 * Create a new message using the string input: str
 */
Notify.prototype.addMessage = function(str) {
	var message = $('<h4 />')
		.text(str);
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
