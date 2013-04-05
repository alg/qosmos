var Config = require('./config'),
    pack   = Config.energyPack;

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

  // Takes out amount of energy.
  // Returns TRUE if died as the result.
  self.decreaseEnergy = function(amt) {
    // can't die twice
    if (self.dead) return false;

    self.energy = Math.max(0, self.energy - amt);

    if (self.energy == 0) self.dead = true;

    return self.dead;
  }

  // true if two nodes are in close proximity
  self.closeTo = function(other) {
    if (other.dead) return false;

    var xoff = self.x > other.x ? self.x - other.x : other.x - self.x,
        yoff = self.y > other.y ? self.y - other.y : other.y - self.y;

    return xoff < 2 && yoff < 2;
  }

  // transfers energy from one node to another
  self.takesEnergyOf = function(other) {
    self.energy += pack;
    return other.decreaseEnergy(pack);
  }

  // scores a point
  self.scorePoint = function() {
    self.score++;
  }

  return self;
}
