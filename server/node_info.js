module.exports = function(name) {
  var self = this;

  // status data
  self.name   = name;
  self.x      = null;
  self.y      = null;
  self.energy = null;
  self.score  = 0;

  // move that is valid for the upcoming tick
  // cleared on every tick.
  self.tickMove = null;

  return self;
}
