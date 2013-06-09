/**
 * client/gui/options.js
 *
 * @author Rohan
 */

function ChatBox() {
	this.chatbox = $('<div id="chatbox" />')
		.addClass('gui')
		.attr('height', '200')
		.attr('width', '500')
		.css({ 
			'display': 'inline',
			'position': 'absolute',
			'bottom': '9%',
			'left': '4%',
		});

	var currURL = window.location.href;
	this.title = $('<div id="chatbox_messages"/>')
        .addClass('gui')
        .css({
            'height': '110',
            'width':  '280',
            'overflow' : 'auto',
            'font-family' : '"Dustismo Bold"',
        });
	$('body').append(this.chatbox);
    this.chatbox.append(this.title);
    this.inputter = '<textarea rows="1" cols="50" id="chatinput" onkeydown="if (event.keyCode == 13) {chatbox_sendMessage(); return false;}"></textarea>'
    this.chatbox.append(this.inputter);
	this.chatbox.show();
	$('#chatinput').hide();
	this.hidden = true;
}

ChatBox.prototype.toggle = function() {
	if (this.hidden) {
		console.log('Showing chatbox');

		$('#chatinput').show();
        $('#chatinput').focus();
        $('#chatinput').val('');
		$('#chatbox').css('opacity', '1.0');
	//	$('.game').css('position', 'absolute');
	//	$('.game').css('opacity', '0.4');
	//	$('#gameTimer').css('opacity', '0.4');
	//	$('#statusBox').css('opacity', '0.4');
	//	$('#scoreboard').css('opacity', '0.4');
        //TODO DisableTurningHere

        chatbox_disableKeyPresses = true;
		this.hidden = false;
	}
	else {
		console.log('Hiding options');
		$('#chatinput').hide();
        $('#chatinput').blur();
	//	$('.game').css('position', 'absolute');
	//	$('.game').css('opacity', '1.0');
	//	$('#gameTimer').css('opacity', '1.0');
	//	$('#statusBox').css('opacity', '1.0');
        //TODO EnableTurningHere

        chatbox_disableKeyPresses = false;
	}
}
