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
'<h1>(To go back to the game, just hit ESC again)</h1><br>' +
'<a href="gamelist"><div class="menuOpt"><h5>Return to the game list</h5></div></a>' +
'<div class="menuOpt"><h5>Invite your friends to this game by sharing the link below!</h5><br>' +
'<center><textarea onclick=\"this.focus();this.select()\" readonly=\"readonly\">' + currURL + '</textarea></center></div><br>' +
'<center><img src="controllers.png" width="450px"></center><br>' +
'<h1>Psst! You can also press TAB to view other players\' scores!</h1>' ));

    this.menu.append(this.title);    
    this.nickname = $('<form> <textarea id="nametagbox" name="nickname" cols="10" rows="1"> nickname </textarea> <input type ="button" onclick="setName()" value="Change it!"/> </form>');
    this.menu.append(this.nickname);
	this.menu.append(this.list);

	$('body').append(this.menu);
	this.menu.hide();

	this.hidden = true;
}

OptionMenu.prototype.toggle = function() {
	if (this.hidden) {
		console.log('Showing options');

		$('#options').show();
		$('.game').css('position', 'absolute');
		$('.game').css('opacity', '0.4');
		$('#gameTimer').css('opacity', '0.4');
		$('#statusBox').css('opacity', '0.4');
<<<<<<< HEAD
=======
		$('#scoreboard').css('opacity', '0.4');

>>>>>>> 693fc4ab74b61820a7dca2246f5b03c3816a3633
		this.hidden = false;
        disableKeyPresses = true;
	}
	else {
		console.log('Hiding options');
		$('#options').hide();
		$('.game').css('position', 'absolute');
		$('.game').css('opacity', '1.0');
		$('#gameTimer').css('opacity', '1.0');
		$('#statusBox').css('opacity', '1.0');
		$('#scoreboard').css('opacity', '1.0');


		this.hidden = true;
        disableKeyPresses = false;
	}
}
