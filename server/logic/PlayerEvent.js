var PlayerEvent = function() {
    this.playerID  : -1,
    this.moving    : false,
    this.front     : false,
    this.Backwards : false,
    this.left      : false,
    this.right     : false,
    this.sprinting : false,
    this.speed     : .25,
    this.angle     : 0
};

exports.PlayerEvent = PlayerEvent;
