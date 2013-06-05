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
  this.statusBox.css('right', '10px');
  this.statusBox.css('top', '10px');
  this.statusBox.css('width', '200px');
  this.statusBox.css('height', '200px');

  // Add status bars and vacuumed bunny counter
  this.addVacuumChargeBar();
  this.addKillCounter();


  // TODO init?
  this.updateVacuumCharge(100);
  this.updateKillCounter(0);

  $('body').append(this.statusBox);
};

StatusBox.prototype.addVacuumChargeBar = function () {
  this.vacuumChargeBar = $('<div id="vacuumChargeBar" />');
  this.vacuumChargeBar.progressbar({value: 0});

  this.statusBox.append(this.vacuumChargeBar);
};

StatusBox.prototype.addKillCounter = function () {
  this.killCounter =
      $('<div id="killCounter"></div>');
  this.killCounter.addClass('gui');

  this.statusBox.append(this.killCounter);
};

/* STATUS ELEMENT MANIPULATION METHODS */

StatusBox.prototype.updateFoodValue = function(value) {
  this.foodBar.progressbar("option", "value", value);
};

StatusBox.prototype.updateVacuumCharge = function(value) {
//  $('#statusBox').html('<h1>vacuum charge:</h1>');
  this.vacuumChargeBar.progressbar("option", "value", value);
};

StatusBox.prototype.updateKillCounter = function(value) {
  this.killCounter.html('<br><h1>bunnies sucked:</h1> <h2>' + value + '</h2>');
  //this.killCounter.html('<h2>' + value + '</h2>');
};
