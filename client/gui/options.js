/**
 * client/gui/options.js
 *
 * @fileoverview Present an interface to change client options. This depends
 * on having jQuery
 * @author Trevor
 * @author Prita Priscilla
 */

function OptionMenu() {
	this.menu = $('<div id="options" />')
		.addClass('gui')
		.attr('height', '500')
		.attr('width', '500')
		.css({ 
			'display': 'inline',
			'position': 'absolute',
			'top': '38%',
			'left': '50%',
			'margin-top': '-250px',
			'margin-left': '-250px',
		});

	var currURL = window.location.href;

	this.title = $('<div id="optionsStuff" />')
		.append($( '<center><h6>MENU</h6></center>' +
'<a href="gamelist"><div class="menuOpt"><h5>Return to the game list</h5></div></a>' )); 

    	this.nickname = $('<div class="menuOpt"><h5>Change your nickname here and hit ENTER!</h5><form><center><textarea onkeydown="if (event.keyCode == 13) {setName(); return false; }" id="nametagbox" name="nickname" placeholder="nickname" maxlength="15"></textarea><center></form></div>');

	this.controllersStuff = ($('<div class="menuOpt"><h5>Invite your friends to this game by sharing the link below!</h5><br>' +
'<center><textarea onclick=\"this.focus();this.select()\" readonly=\"readonly\">' + currURL + '</textarea></center></div><br>' +
'<center><img src="controllers.png" width="400px"></center>'));

    this.menu.append(this.title);    
    this.menu.append(this.nickname);
    this.menu.append(this.controllersStuff);

	this.menu.append(this.list);

	$('body').append(this.menu);
	this.menu.hide();
    
	this.hidden = true;
}

OptionMenu.prototype.toggle = function() {
	if (this.hidden) {
		$('#options').show();
        $('#nametagbox').focus();
        $('#nametagbox').val('');
		$('.game').css('position', 'absolute');
		$('.game').css('opacity', '0.4');
		$('#gameTimer').css('opacity', '0.4');
		$('#statusBox').css('opacity', '0.4');
		$('#scoreboard').css('opacity', '0.4');
		$('#stats').css('opacity', '1.0');
        
        //TODO DisableTurningHere
		this.hidden = false;
        options_disableKeyPresses = true;
	}
	else {
		$('#options').hide();
        $('#nametagbox').blur();
		$('.game').css('position', 'absolute');
		$('.game').css('opacity', '1.0');
		$('#gameTimer').css('opacity', '1.0');
		$('#statusBox').css('opacity', '1.0');
		$('#scoreboard').css('opacity', '1.0');
		$('#stats').css('opacity', '0.0');

        //TODO EnableTurningHere
        options_disableKeyPresses = false;
	}
}
