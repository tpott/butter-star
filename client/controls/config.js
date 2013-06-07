/**
 * client/controls/config.js
 *
 * Abstract client storage and synchronize with server
 * Dependencies: jQuery, Connection
 *
 * @author Trevor Pottinger
 */

// returns the default config
function Config() {
	this.setDefaults();
}

Config.prototype.setDefaults = function() {
	this.camera_vertical_invert = false;
	this.camera_speed = 0.0;
	this.nickname = 'Nickname';

	this.minimap = true;
	this.stats = true;

	this.playerid = '';
};

function newline() {
	return $('<br />');
}

/**
 * This should be called from the options menu when it gets opened
 */
Config.prototype.render = function() {
	var div = $('<div id="config" />').attr('align', 'right');

	var form = $('<form />').attr('float', 'right');
	div.append(form);

	form.append('Camera invert');
	form.append($('<input type="checkbox" />').attr('checked', 
			this.camera_vertical_invert));
	form.append(newline());
	form.append('Camera speed');
	form.append($('<div />').slider({ min: -3.0, max: 3.0, step: 0.1,
		value: this.camera_speed}));
	form.append(newline());
	form.append('Nickname');
	form.append($('<input type="text" />').text(this.nickname));
	form.append(newline());

	form.append('Minimap enabled');
	form.append($('<input type="checkbox" />').attr('checked', 
			this.minimap));
	form.append(newline());
	form.append('Stats enabled');
	form.append($('<input type="checkbox" />').attr('checked', 
			this.stats));
	form.append(newline());

	return div;
};

/**
 * This should be called from the options menu when it gets closed
 */
Config.prototype.update = function() {
	// TODO get values from form
	
	connection.sendConfig(this);
};
