/**
 * Adds status bars to the client game.
 * @author Jennifer Fang
 * @author Prita Hasjim
 */


function StatusBox() {
  this.statusBox = $('<div id="statusBox" />');
  this.statusBox.addClass('gui');
  this.statusBox.css('display', 'inline');
  this.statusBox.css('position', 'absolute');
  this.statusBox.css('right', '0px');
  this.statusBox.css('top', '0px');
  this.statusBox.css('width', '200px');
  this.statusBox.css('height', '200px');

  // Add status bars and vacuumed bunny counter
  // this.addFoodBar();
  this.addVacuumChargeBar();
  this.addKillCounter();


  // TODO init?
  this.updateVacuumCharge(100);
  this.updateKillCounter(0);

  $('body').append(this.statusBox);
};

/* CREATE STATUS ELEMENTS */
StatusBox.prototype.addFoodBar = function () {
  this.foodBar = $('<div id="foodBar" />');
  this.foodBar.addClass('gui');
  this.foodBar.progressbar({value: 0});

  this.statusBox.append(this.foodBar);
};

StatusBox.prototype.addVacuumChargeBar = function () {
  this.vacuumChargeBar = $('<div id="vacuumChargeBar" />')
		.addClass('gui')
		.attr('height', '100')
		.attr('width', '200')
		.css({ 
			'display': 'inline',
			'position': 'absolute',
			'top': '5px',
			'left': '5px',
			'background': '#ffffff',
    			'background': '-webkit-linear-gradient(top, #ffffff 0%, #dbf5ff 100%)',
    			'background': '-linear-gradient(top, #ffffff 0%, #dbf5ff 100%)',
    			'background': '-moz-linear-gradient(top, #ffffff 0%, #dbf5ff 100%)',
    			'border-radius': '10px', 
    			'-moz-border-radius': '10px', 
    			'-webkit-border-radius': '10px' 
		});

  this.vacuumChargeBar.addClass('gui');
  this.vacuumChargeBar.progressbar({value: 0});

  this.statusBox.append(this.vacuumChargeBar);
};

StatusBox.prototype.addKillCounter = function () {
  this.killCounter =
      $('<h1 id="killCounter" align="right"></h1>');
  this.killCounter.addClass('gui');

  this.statusBox.append(this.killCounter);
};

/* STATUS ELEMENT MANIPULATION METHODS */

StatusBox.prototype.updateFoodValue = function(value) {
  this.foodBar.progressbar("option", "value", value);
};

StatusBox.prototype.updateVacuumCharge = function(value) {
  this.vacuumChargeBar.progressbar("option", "value", value);
};

StatusBox.prototype.updateKillCounter = function(value) {
  this.killCounter.text(value);
};
