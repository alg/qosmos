module.exports = function(x, y, energy) {
  var self = this

  this.x = x;
  this.y = y;
  this.energy = energy;

  self.increaseAge = function() {
    self.age++;
  }

  return self;
}
