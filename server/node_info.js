module.exports = function(name) {
  var self = this;

  // status data
  self.name   = name;
  self.x      = null;
  self.y      = null;
  self.energy = null;
  self.score  = 0;
  self.dead   = false;

  // move that is valid for the upcoming tick
  // cleared on every tick.
  self.tickMove = null;

  self.decreaseEnergy = function() {
    self.energy = Math.max(0, self.energy - 5);
    if (self.energy == 0) self.dead = true;
  }

  return self;
}
