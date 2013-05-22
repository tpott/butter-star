/**
 * Adds status bars to the client game.
 * @author Jennifer Fang
 */


function StatusBox() {
  this.statusBox = $('<div id="statusBox" />');
  this.statusBox.addClass('gui');

  // Add status bars and vacuumed bunny counter
  this.addFoodBar();
  this.addVacuumChargeBar();
  this.addVacuumedBunniesCounter();

  $('body').append(this.statusBox);
};

StatusBox.prototype.addFoodBar = function () {
  var foodBar = $('<div id="foodBar" />');
  foodBar.addClass('gui');
  //this.progressbar({value: 0});

  this.statusBox.append(foodBar);
};

StatusBox.prototype.addVacuumChargeBar = function () {
  var vacuumChargeBar = $('<div id="vacuumChargeBar" />');
  vacuumChargeBar.addClass('gui');
  //this.progressbar({value: 0});

  this.statusBox.append(vacuumChargeBar);
};

StatusBox.prototype.addVacuumedBunniesCounter = function () {
  var vacuumedBunniesCounter = $('<div id="vacuumedBunniesCounter" align="right" />');
  vacuumedBunniesCounter.addClass('gui');

  this.statusBox.append(vacuumedBunniesCounter);
};
