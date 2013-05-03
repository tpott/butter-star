var ControlsEvent = function() {
    this.moving   = false;
	this.isVacuum  = false;
    this.front     = false;
    this.Backwards = false;
    this.left      = false;
    this.right     = false;
    this.sprinting = false;
    this.speed     = .25;
    this.angle     = 0;
    this.playerID  = -1;
};

ControlsEvent.prototype.set = function(field, value) {
    this[field] = value;
    hasBeenSent = false;
}
